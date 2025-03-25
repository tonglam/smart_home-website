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

  return {
    url:
      process.env.MQTT_BROKER_URL ||
      "mqtts://abe3cde2e1524333b6306bbe4a8d8b28.s1.eu.hivemq.cloud:8883",
    clientId,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  };
}

// Connect to MQTT broker
export async function connectMqtt(): Promise<MqttClient | null> {
  if (client && client.connected) {
    return client;
  }

  try {
    const config = getMqttConfig();

    // Validate required credentials
    if (!config.username || !config.password) {
      throw new Error(
        "MQTT_USERNAME and MQTT_PASSWORD environment variables are required"
      );
    }

    // Connect to the broker
    return new Promise((resolve, reject) => {
      const mqttClient = mqtt.connect(config.url, {
        clientId: config.clientId,
        username: config.username,
        password: config.password,
        protocol: "mqtts",
        rejectUnauthorized: true,
      });

      mqttClient.on("connect", () => {
        console.log("Connected to MQTT broker");
        client = mqttClient;
        resolve(mqttClient);
      });

      mqttClient.on("error", (err) => {
        logError(err, "MQTT connection error");
        reject(err);
      });

      // Set a timeout
      setTimeout(() => {
        if (!mqttClient.connected) {
          mqttClient.end();
          reject(new Error("MQTT connection timeout"));
        }
      }, 5000);
    });
  } catch (error) {
    logError(error, "Failed to connect to MQTT broker");
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

// Subscribe to a topic and handle messages
export async function subscribeToTopic(
  topic: string,
  callback: (topic: string, message: string) => void
): Promise<boolean> {
  try {
    const mqttClient = await connectMqtt();
    if (!mqttClient) {
      return false;
    }

    return new Promise((resolve) => {
      mqttClient.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          logError(err, `Failed to subscribe to ${topic}`);
          resolve(false);
        } else {
          // Set up message handler
          mqttClient.on("message", (receivedTopic, message) => {
            if (receivedTopic === topic) {
              callback(receivedTopic, message.toString());
            }
          });
          resolve(true);
        }
      });
    });
  } catch (error) {
    logError(error, `Error subscribing to ${topic}`);
    return false;
  }
}

// Unsubscribe from a topic
export async function unsubscribeFromTopic(topic: string): Promise<boolean> {
  try {
    const mqttClient = await connectMqtt();
    if (!mqttClient) {
      return false;
    }

    return new Promise((resolve) => {
      mqttClient.unsubscribe(topic, (err) => {
        if (err) {
          logError(err, `Failed to unsubscribe from ${topic}`);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  } catch (error) {
    logError(error, `Error unsubscribing from ${topic}`);
    return false;
  }
}

// Disconnect from MQTT broker
export function disconnectMqtt(): boolean {
  if (client && client.connected) {
    client.end();
    client = null;
    return true;
  }
  return false;
}
