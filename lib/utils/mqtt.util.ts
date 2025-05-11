import mqtt, { type IClientOptions, type MqttClient } from "mqtt";

interface MqttConfig {
  url: string;
  clientId: string;
  username?: string;
  password?: string;
}

let client: MqttClient | null = null;
const topicCallbacks = new Map<
  string,
  Set<(topic: string, message: string) => void>
>();

let isConnecting: boolean = false;

function logError(error: unknown, context: string): void {
  if (error instanceof Error) {
    console.error(`[MQTT Server Util] ${context}: ${error.message}`);
  } else {
    console.error(`[MQTT Server Util] ${context}: Unknown error`, error);
  }
}

function getMqttConfig(): MqttConfig {
  const clientId = `smart-home-server-${Math.random()
    .toString(16)
    .substring(2, 8)}`;

  const mqttsPort = 8883;

  const hostname = process.env.MQTT_BROKER_URL;
  const username = process.env.MQTT_USERNAME;
  const password = process.env.MQTT_PASSWORD;
  const port = mqttsPort;

  if (!hostname || !username || !password) {
    const missingVars = _getMissingEnvVarNames({
      hostname,
      username,
      password,
    });
    const errorMsg = `Missing Server-Side MQTT environment variables: ${missingVars.join(", ")}`;
    console.error(`[MQTT Server Util] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const protocol = "mqtts";
  const url = `${protocol}://${hostname}:${port}`;

  return {
    url,
    clientId,
    username,
    password,
  };
}

function _getMissingEnvVarNames(vars: {
  hostname?: string;
  username?: string;
  password?: string;
}): string[] {
  const required = {
    MQTT_BROKER_URL: vars.hostname,
    MQTT_USERNAME: vars.username,
    MQTT_PASSWORD: vars.password,
  };

  return Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

function handleIncomingMessage(topic: string, message: Buffer): void {
  const callbacks = topicCallbacks.get(topic);
  if (callbacks) {
    const messageString = message.toString();
    console.log(`[MQTT Server Util] Received message on topic ${topic}`);
    callbacks.forEach((callback) => {
      try {
        callback(topic, messageString);
      } catch (error) {
        logError(error, `Error in server-side callback for topic ${topic}`);
      }
    });
  }
}

export async function connectMqtt(): Promise<MqttClient | null> {
  if (client && client.connected) {
    return client;
  }
  if (client && !client.connected) {
    console.log(
      "[MQTT Server Util] Cleaning up stale MQTT client before reconnecting."
    );
    client.end(true);
    client = null;
  }

  if (isConnecting) {
    console.warn(
      "[MQTT Server Util] Connection attempt already in progress, waiting..."
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (client && client.connected) return client;
    console.warn(
      "[MQTT Server Util] Proceeding after wait, client still not available."
    );
  }

  isConnecting = true;
  const connectFunctionStartTime = Date.now();

  try {
    const config = getMqttConfig();

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

    console.log(
      `[MQTT Server Util] Attempting MQTTS connection to ${config.url}...`
    );
    const connectionPromiseStartTime = Date.now();
    return new Promise((resolve, reject) => {
      const newClient = mqtt.connect(config.url, options);
      newClient.removeAllListeners();

      const connectionTimeoutTimer = setTimeout(() => {
        const duration = Date.now() - connectionPromiseStartTime;
        console.error(
          `[MQTT Server Util] ❌ MQTTS connection timeout for ${config.url} after ${duration}ms (Timeout set to ${options.connectTimeout}ms)`
        );
        isConnecting = false;
        newClient.removeAllListeners();
        newClient.end(true);
        reject(new Error(`MQTTS connection timeout to ${config.url}`));
      }, options.connectTimeout);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      newClient.on("connect", (_connack) => {
        clearTimeout(connectionTimeoutTimer);
        const connectDuration = Date.now() - connectionPromiseStartTime;
        console.log(
          `[MQTT Server Util] ✅ MQTTS connected successfully to ${config.url} in ${connectDuration}ms`
        );
        client = newClient;
        isConnecting = false;

        setupPersistentEventHandlers(client);

        resolve(client);
      });

      newClient.on("error", (err) => {
        clearTimeout(connectionTimeoutTimer);
        const duration = Date.now() - connectionPromiseStartTime;
        logError(
          err,
          `MQTTS connection error for ${config.url} after ${duration}ms`
        );
        isConnecting = false;
        newClient.removeAllListeners();
        newClient.end(true);
        reject(err);
      });
    });
  } catch (error) {
    const duration = Date.now() - connectFunctionStartTime;
    logError(
      error,
      `Failed to initiate MQTTS connection setup after ${duration}ms`
    );
    isConnecting = false;
    return null;
  }
}

function setupPersistentEventHandlers(clientInstance: MqttClient) {
  const handleClose = () => {
    console.log(`[MQTT Server Util] 🚪 Persistent MQTTS connection closed.`);
    if (client === clientInstance) {
      client = null;
    }
    clientInstance.removeAllListeners();
  };
  clientInstance.removeListener("close", handleClose);
  clientInstance.on("close", handleClose);

  const handleError = (err: Error) => {
    logError(err, "Persistent MQTTS client error");
    if (client === clientInstance && !clientInstance.connected) {
      console.log(
        "[MQTT Server Util] Forcing close due to persistent error on disconnected client."
      );
      clientInstance.end(true);
    }
  };
  clientInstance.removeListener("error", handleError);
  clientInstance.on("error", handleError);

  const handleOffline = () => {
    console.warn(`[MQTT Server Util] 🔌 Persistent MQTTS client is offline.`);
  };
  clientInstance.removeListener("offline", handleOffline);
  clientInstance.on("offline", handleOffline);

  const handleReconnect = () => {
    console.log(
      `[MQTT Server Util] ⏳ Persistent MQTTS client attempting to reconnect...`
    );
  };
  clientInstance.removeListener("reconnect", handleReconnect);
  clientInstance.on("reconnect", handleReconnect);

  const handleMessageWrapper = (topic: string, message: Buffer) => {
    handleIncomingMessage(topic, message);
  };
  clientInstance.removeListener("message", handleMessageWrapper);
  clientInstance.on("message", handleMessageWrapper);
}

const originalConnectMqtt = connectMqtt;
export async function connectMqttWithHandlers(): Promise<MqttClient | null> {
  const connectedClient = await originalConnectMqtt();
  if (connectedClient && !connectedClient.listenerCount("close")) {
    setupPersistentEventHandlers(connectedClient);
  }
  return connectedClient;
}

export async function publishMessage(
  topic: string,
  message: string | object
): Promise<boolean> {
  let mqttClient: MqttClient | null = null;
  try {
    mqttClient = await connectMqtt();
    if (!mqttClient || !mqttClient.connected) {
      logError(
        new Error("MQTT client is not connected or available"),
        `Failed to publish to ${topic}`
      );
      return false;
    }

    const payload =
      typeof message === "string" ? message : JSON.stringify(message);

    await mqttClient.publishAsync(topic, payload, { qos: 1 });
    console.log(`[MQTT Server Util] ✉️ Published message to ${topic}`);
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
  let currentClient: MqttClient | null = null;
  console.warn(
    "[MQTT Server Util] Subscribing from backend is generally not recommended for client data relay. Consider SSE."
  );
  try {
    currentClient = await connectMqtt();
    if (!currentClient || !currentClient.connected) {
      logError(
        new Error("MQTT client is not connected"),
        `Failed to subscribe to ${topic}`
      );
      return false;
    }

    const callbacks = topicCallbacks.get(topic) || new Set();
    const needsBrokerSubscription = callbacks.size === 0;

    callbacks.add(callback);
    topicCallbacks.set(topic, callbacks);
    console.log(
      `[MQTT Server Util] 👂 Added server-side listener for topic ${topic}.`
    );

    if (needsBrokerSubscription) {
      console.log(`[MQTT Server Util] 📡 Subscribing to ${topic} on broker...`);
      try {
        const granted = await currentClient.subscribeAsync(topic, { qos: 1 });
        if (granted && granted.length > 0) {
          console.log(
            `[MQTT Server Util] 👍 Subscribed to ${granted[0]?.topic ?? topic}`
          );
        } else {
          console.warn(
            `[MQTT Server Util] ⚠️ Subscription ack'd, grants unclear.`
          );
        }
        return true;
      } catch (err) {
        logError(err, `Failed to subscribe to ${topic} on broker`);
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          topicCallbacks.delete(topic);
        }
        return false;
      }
    } else {
      return true;
    }
  } catch (error) {
    logError(error, `Error processing server-side subscription for ${topic}`);
    const callbacks = topicCallbacks.get(topic);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        topicCallbacks.delete(topic);
      }
    }
    return false;
  }
}

export async function unsubscribeFromTopic(
  topic: string,
  callback: (topic: string, message: string) => void
): Promise<boolean> {
  const currentClient = client;
  console.warn("[MQTT Server Util] Unsubscribing from backend.");

  try {
    const callbacks = topicCallbacks.get(topic);
    if (!callbacks || !callbacks.has(callback)) {
      return false;
    }

    callbacks.delete(callback);
    console.log(
      `[MQTT Server Util] 👂 Removed server-side listener for topic ${topic}.`
    );

    if (callbacks.size === 0) {
      topicCallbacks.delete(topic);
      console.log(
        `[MQTT Server Util] 📡 Unsubscribing from ${topic} on broker...`
      );

      if (currentClient && currentClient.connected) {
        try {
          await currentClient.unsubscribeAsync(topic);
          console.log(
            `[MQTT Server Util] 👍 Unsubscribed from ${topic} on broker.`
          );
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

export function disconnectMqtt(): boolean {
  if (client) {
    const clientUrl = client.options.host || "unknown URL";
    console.log(
      `[MQTT Server Util] 🔌 Attempting to disconnect MQTTS client from ${clientUrl}...`
    );
    try {
      client.end(true, () => {
        console.log(
          `[MQTT Server Util] ✅ MQTTS client disconnected cleanly from ${clientUrl}.`
        );
      });
      client = null;
      topicCallbacks.clear();
      return true;
    } catch (error) {
      logError(error, "Error during MQTTS client.end()");
      client = null;
      topicCallbacks.clear();
      return false;
    }
  } else {
    return false;
  }
}
