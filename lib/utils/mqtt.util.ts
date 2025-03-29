import mqtt, { MqttClient } from "mqtt";

// MQTT connection configuration
interface MqttConfig {
  url: string;
  clientId: string;
  username?: string;
  password?: string;
}

// Track connection state
let client: MqttClient | null = null;
// Track subscribed topics and their callbacks
const topicCallbacks = new Map<
  string,
  Set<(topic: string, message: string) => void>
>();

// Simple error logger
function logError(error: unknown, context: string): void {
  if (error instanceof Error) {
    console.error(`${context}: ${error.message}`);
  } else {
    console.error(`${context}: Unknown error`, error);
  }
}

// Get MQTT configuration from environment variables
function getMqttConfig(): MqttConfig {
  const clientId = `smart-home-app-${Math.random()
    .toString(16)
    .substring(2, 8)}`;

  // Use NEXT_PUBLIC_ variables for client-side access (e.g., test page)
  const hostname = process.env.MQTT_BROKER_URL;
  const port = process.env.MQTT_PORT;
  const username = process.env.MQTT_USERNAME;
  const password = process.env.MQTT_PASSWORD;

  if (!hostname || !port || !username || !password) {
    throw new Error(
      "Client-side MQTT requires: MQTT_BROKER_URL, MQTT_PORT, MQTT_USERNAME, and MQTT_PASSWORD environment variables"
    );
  }

  // Construct the full WSS URL
  const url = `wss://${hostname}:${port}/mqtt`;

  return {
    url,
    clientId,
    username,
    password,
  };
}

// Central message handler
function handleIncomingMessage(topic: string, message: Buffer): void {
  const callbacks = topicCallbacks.get(topic);
  if (callbacks) {
    const messageString = message.toString();
    callbacks.forEach((callback) => {
      try {
        callback(topic, messageString);
      } catch (error) {
        logError(error, `Error in callback for topic ${topic}`);
      }
    });
  }
}

// Connect to MQTT broker using WSS
export async function connectMqtt(): Promise<MqttClient | null> {
  if (client && client.connected) {
    return client;
  }

  try {
    const config = getMqttConfig();

    if (!config.username || !config.password) {
      throw new Error(
        "MQTT_USERNAME and MQTT_PASSWORD environment variables are required"
      );
    }

    // Connect to the broker using WSS
    return new Promise((resolve, reject) => {
      const mqttClient = mqtt.connect(config.url, {
        clientId: config.clientId,
        username: config.username,
        password: config.password,
        protocol: "wss", // Still specify wss for clarity/safety
        path: "/mqtt", // Still specify path
        rejectUnauthorized: true,
      });

      mqttClient.on("connect", () => {
        client = mqttClient;
        client.removeAllListeners("message");
        client.on("message", handleIncomingMessage);
        resolve(mqttClient);
      });

      mqttClient.on("error", (err) => {
        logError(err, `MQTT connection error for ${config.url}`);
        reject(err);
      });

      // Set a timeout
      const timeoutId = setTimeout(() => {
        if (!mqttClient.connected) {
          console.error(
            `❌ MQTT connection timeout for ${config.url} after 5 seconds.`
          );
          mqttClient.end(true);
          reject(new Error("MQTT connection timeout"));
        }
      }, 5000);

      mqttClient.on("connect", () => {
        clearTimeout(timeoutId);
      });
    });
  } catch (error) {
    logError(error, "Failed to initiate MQTT connection");
    return null;
  }
}

// Publish a message to a topic
export async function publishMessage(
  topic: string,
  message: string | object
): Promise<boolean> {
  try {
    const mqttClient = await connectMqtt();
    if (!mqttClient) {
      return false;
    }

    const payload =
      typeof message === "string" ? message : JSON.stringify(message);

    return new Promise((resolve) => {
      mqttClient.publish(topic, payload, { qos: 1 }, (err) => {
        if (err) {
          logError(err, `Failed to publish message to ${topic}`);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  } catch (error) {
    logError(error, `Error publishing to ${topic}`);
    return false;
  }
}

// Subscribe to a topic and register a callback
export async function subscribeToTopic(
  topic: string,
  callback: (topic: string, message: string) => void
): Promise<boolean> {
  try {
    // Ensure client is connected
    const currentClient = await connectMqtt();
    if (!currentClient || !currentClient.connected) {
      logError(
        new Error("MQTT client is not connected"),
        `Failed to subscribe to ${topic}`
      );
      return false;
    }

    // Get or create the Set of callbacks for this topic
    const callbacks = topicCallbacks.get(topic) || new Set();
    const needsBrokerSubscription = callbacks.size === 0;

    // Add the new callback to our tracking
    callbacks.add(callback);
    topicCallbacks.set(topic, callbacks);

    // If this is the first callback for this topic, subscribe on the broker
    if (needsBrokerSubscription) {
      return new Promise((resolve) => {
        currentClient.subscribe(topic, { qos: 1 }, (err) => {
          if (err) {
            logError(err, `Failed to subscribe to ${topic} on broker`);
            callbacks.delete(callback);
            if (callbacks.size === 0) {
              topicCallbacks.delete(topic);
            }
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    } else {
      return true;
    }
  } catch (error) {
    logError(error, `Error processing subscription for ${topic}`);
    return false;
  }
}

// Unsubscribe a specific callback from a topic
export async function unsubscribeFromTopic(
  topic: string,
  callback: (topic: string, message: string) => void
): Promise<boolean> {
  try {
    const currentClient = client;

    // Check if we are actually connected
    if (!currentClient || !currentClient.connected) {
      logError(
        new Error("MQTT client is not connected"),
        `Cannot unsubscribe from ${topic}`
      );
    }

    const callbacks = topicCallbacks.get(topic);
    if (callbacks) {
      callbacks.delete(callback);

      // If this was the last callback, unsubscribe from the broker
      if (callbacks.size === 0) {
        topicCallbacks.delete(topic);

        // Only attempt broker unsubscribe if connected
        if (currentClient && currentClient.connected) {
          return new Promise((resolve) => {
            currentClient.unsubscribe(topic, (err) => {
              if (err) {
                logError(err, `Failed to unsubscribe from ${topic} on broker`);
                resolve(false);
              } else {
                resolve(true);
              }
            });
          });
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    logError(error, `Error unsubscribing from ${topic}`);
    return false;
  }
}

// Disconnect from MQTT broker
export function disconnectMqtt(): boolean {
  if (client && client.connected) {
    try {
      client.removeAllListeners();
      return true;
    } catch (error) {
      logError(error, "Error during MQTT disconnection");
      // Attempt cleanup even if error occurs
      client = null;
      topicCallbacks.clear();
      return false;
    }
  }
  if (client) {
    client.removeAllListeners();
    client = null;
    topicCallbacks.clear();
  }

  return false;
}
