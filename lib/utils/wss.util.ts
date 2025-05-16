import mqtt, { type IClientOptions, type MqttClient } from "mqtt";

interface WssConfig {
  url: string;
  clientId: string;
  username?: string;
  password?: string;
}

let wssClient: MqttClient | null = null;
const wssTopicCallbacks = new Map<
  string,
  Set<(topic: string, message: string) => void>
>();

let isWssConnecting: boolean = false;

function logError(error: unknown, context: string): void {
  if (error instanceof Error) {
    console.error(`[WSS Util] ${context}: ${error.message}`);
  } else {
    console.error(`[WSS Util] ${context}: Unknown error`, error);
  }
}

function getWssConfig(): WssConfig {
  const clientId = `smart-home-server-wss-${Math.random()
    .toString(16)
    .substring(2, 8)}`;

  const wssHostname = process.env.NEXT_PUBLIC_WSS_HOSTNAME;
  const wssPort = 8884;
  const wssPath = "/mqtt";

  const username = process.env.NEXT_PUBLIC_WSS_USERNAME;
  const password = process.env.NEXT_PUBLIC_WSS_PASSWORD;

  const missingVars: string[] = [];
  if (!wssHostname) missingVars.push("NEXT_PUBLIC_WSS_HOSTNAME");
  if (!username) missingVars.push("NEXT_PUBLIC_WSS_USERNAME");
  if (!password) missingVars.push("NEXT_PUBLIC_WSS_PASSWORD");

  if (missingVars.length > 0) {
    const errorMsg = `Missing WSS environment variables: ${missingVars.join(", ")}. Please ensure these are set.`;
    console.error(`[WSS Util] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const protocol = "wss";
  const formattedPath = wssPath;
  const url = `${protocol}://${wssHostname}:${wssPort}${formattedPath}`;

  return {
    url,
    clientId,
    username,
    password,
  };
}

function handleIncomingMessage(topic: string, message: Buffer): void {
  const callbacks = wssTopicCallbacks.get(topic);
  if (callbacks) {
    const messageString = message.toString();
    callbacks.forEach((callback) => {
      try {
        callback(topic, messageString);
      } catch (error) {
        logError(error, `Error in server-side callback for topic ${topic}`);
      }
    });
  }
}

export async function connectWss(): Promise<MqttClient | null> {
  if (wssClient && wssClient.connected) {
    return wssClient;
  }
  if (wssClient && !wssClient.connected) {
    wssClient.end(true);
    wssClient = null;
  }

  if (isWssConnecting) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (wssClient && wssClient.connected) return wssClient;
  }

  isWssConnecting = true;
  const connectFunctionStartTime = Date.now();

  try {
    const config = getWssConfig();

    const options: IClientOptions = {
      clientId: config.clientId,
      username: config.username,
      password: config.password,
      rejectUnauthorized: false,
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 15000,
    };

    const connectionPromiseStartTime = Date.now();
    return new Promise((resolve, reject) => {
      const newClient = mqtt.connect(config.url, options);
      newClient.removeAllListeners();

      const connectionTimeoutTimer = setTimeout(() => {
        const duration = Date.now() - connectionPromiseStartTime;
        console.error(
          `[WSS Util] ❌ WSS connection timeout for ${config.url} after ${duration}ms (Timeout set to ${options.connectTimeout}ms)`
        );
        isWssConnecting = false;
        newClient.removeAllListeners();
        newClient.end(true);
        reject(new Error(`WSS connection timeout to ${config.url}`));
      }, options.connectTimeout);

      newClient.on("connect", (_connack) => {
        clearTimeout(connectionTimeoutTimer);
        const _connectDuration = Date.now() - connectionPromiseStartTime;
        wssClient = newClient;
        isWssConnecting = false;

        setupPersistentEventHandlers(wssClient);

        resolve(wssClient);
      });

      newClient.on("error", (err) => {
        clearTimeout(connectionTimeoutTimer);
        const duration = Date.now() - connectionPromiseStartTime;
        logError(
          err,
          `WSS connection error for ${config.url} after ${duration}ms`
        );
        isWssConnecting = false;
        newClient.removeAllListeners();
        newClient.end(true);
        reject(err);
      });
    });
  } catch (error) {
    const duration = Date.now() - connectFunctionStartTime;
    logError(
      error,
      `Failed to initiate WSS connection setup after ${duration}ms`
    );
    isWssConnecting = false;
    return null;
  }
}

function setupPersistentEventHandlers(clientInstance: MqttClient) {
  const handleClose = () => {
    if (wssClient === clientInstance) {
      wssClient = null;
    }
    clientInstance.removeAllListeners();
  };
  clientInstance.removeListener("close", handleClose);
  clientInstance.on("close", handleClose);

  const handleError = (err: Error) => {
    logError(err, "Persistent WSS client error");
    if (wssClient === clientInstance && !clientInstance.connected) {
      clientInstance.end(true);
    }
  };
  clientInstance.removeListener("error", handleError);
  clientInstance.on("error", handleError);

  const handleOffline = () => {};
  clientInstance.removeListener("offline", handleOffline);
  clientInstance.on("offline", handleOffline);

  const handleReconnect = () => {};
  clientInstance.removeListener("reconnect", handleReconnect);
  clientInstance.on("reconnect", handleReconnect);

  const handleMessageWrapper = (topic: string, message: Buffer) => {
    handleIncomingMessage(topic, message);
  };
  clientInstance.removeListener("message", handleMessageWrapper);
  clientInstance.on("message", handleMessageWrapper);
}

export async function publishMessage(
  topic: string,
  message: string | object
): Promise<boolean> {
  let currentWssClient: MqttClient | null = null;
  try {
    currentWssClient = await connectWss();
    if (!currentWssClient || !currentWssClient.connected) {
      logError(
        new Error("WSS client is not connected or available"),
        `Failed to publish to ${topic}`
      );
      return false;
    }

    const payload =
      typeof message === "string" ? message : JSON.stringify(message);

    await currentWssClient.publishAsync(topic, payload, { qos: 2 });
    return true;
  } catch (error) {
    logError(error, `Error publishing to ${topic}`);
    return false;
  }
}

export async function subscribeToTopic(
  topic: string,
  callback: (topic: string, message: string) => void
): Promise<boolean> {
  let currentWssClient: MqttClient | null = null;

  try {
    currentWssClient = await connectWss();
    if (!currentWssClient || !currentWssClient.connected) {
      logError(
        new Error("WSS client is not connected"),
        `Failed to subscribe to ${topic}`
      );
      return false;
    }

    const callbacks = wssTopicCallbacks.get(topic) || new Set();
    const needsBrokerSubscription = callbacks.size === 0;

    callbacks.add(callback);
    wssTopicCallbacks.set(topic, callbacks);

    if (needsBrokerSubscription) {
      try {
        await currentWssClient.subscribeAsync(topic, { qos: 0 });
        return true;
      } catch (err) {
        logError(err, `Failed to subscribe to ${topic} on broker`);
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          wssTopicCallbacks.delete(topic);
        }
        return false;
      }
    } else {
      return true;
    }
  } catch (error) {
    logError(error, `Error processing server-side subscription for ${topic}`);
    const callbacks = wssTopicCallbacks.get(topic);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        wssTopicCallbacks.delete(topic);
      }
    }
    return false;
  }
}

export async function unsubscribeFromTopic(
  topic: string,
  callback: (topic: string, message: string) => void
): Promise<boolean> {
  const currentWssClient = wssClient;

  try {
    const callbacks = wssTopicCallbacks.get(topic);
    if (!callbacks || !callbacks.has(callback)) {
      return false;
    }

    callbacks.delete(callback);

    if (callbacks.size === 0) {
      wssTopicCallbacks.delete(topic);

      if (currentWssClient && currentWssClient.connected) {
        try {
          await currentWssClient.unsubscribeAsync(topic);
          return true;
        } catch (err) {
          logError(err, `Failed to unsubscribe from ${topic} on broker`);
          return false;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  } catch (error) {
    logError(error, `Error unsubscribing server-side from ${topic}`);
    return false;
  }
}

export function disconnectWss(): boolean {
  if (wssClient) {
    try {
      wssClient.end(true, () => {});
      wssClient = null;
      wssTopicCallbacks.clear();
      isWssConnecting = false;
      return true;
    } catch (error) {
      logError(error, "Error during WSS client.end()");
      wssClient = null;
      wssTopicCallbacks.clear();
      isWssConnecting = false;
      return false;
    }
  } else {
    return false;
  }
}
