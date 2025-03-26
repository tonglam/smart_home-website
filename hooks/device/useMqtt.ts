"use client";

import mqtt, { MqttClient } from "mqtt";
import { useEffect, useState } from "react";

interface MqttState {
  client: MqttClient | null;
  error: Error | null;
  isConnected: boolean;
}

export function useMqtt() {
  const [state, setState] = useState<MqttState>({
    client: null,
    error: null,
    isConnected: false,
  });

  useEffect(() => {
    // Connect to MQTT broker
    const client = mqtt.connect(
      process.env.NEXT_PUBLIC_MQTT_BROKER_URL || "ws://localhost:8083/mqtt",
      {
        clientId: `web_${Math.random().toString(16).substring(2, 10)}`,
        clean: true,
        reconnectPeriod: 5000,
        connectTimeout: 30 * 1000,
      }
    );

    client.on("connect", () => {
      console.log("MQTT Connected");
      setState((prev) => ({ ...prev, client, isConnected: true, error: null }));
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err : new Error("MQTT Error"),
      }));
    });

    client.on("offline", () => {
      console.log("MQTT Offline");
      setState((prev) => ({ ...prev, isConnected: false }));
    });

    client.on("reconnect", () => {
      console.log("MQTT Reconnecting");
    });

    return () => {
      if (client) {
        client.end(true);
      }
    };
  }, []);

  return state;
}
