"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Video } from "lucide-react";
import { useEffect, useState } from "react";
import mqtt from "mqtt";

const MQTT_BROKER = "849ccde8bee24a28a3de955a812bbf44.s1.eu.hivemq.cloud";
const MQTT_PORT = 8884;
const MQTT_TOPIC = "camera/stream";
const MQTT_USERNAME = "group24";
const MQTT_PASSWORD = "CITS5506IoT";

export function CameraFeed() {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to MQTT broker with credentials
    const client = mqtt.connect(`wss://${MQTT_BROKER}:${MQTT_PORT}/mqtt`, {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      clientId: `web_${Math.random().toString(16).slice(3)}`,
      clean: true,
      rejectUnauthorized: false
    });

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      setIsConnected(true);
      client.subscribe(MQTT_TOPIC);
    });

    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        setImageSrc(`data:image/jpeg;base64,${data.image}`);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    client.on("error", (error) => {
      console.error("MQTT Error:", error);
      setIsConnected(false);
    });

    client.on("close", () => {
      console.log("MQTT connection closed");
      setIsConnected(false);
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Real-time Camera</h3>
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5" />
            </div>
            <span className={`text-sm ${isConnected ? "text-green-500" : "text-red-500"}`}>
              {isConnected ? "Live" : "Disconnected"}
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-video relative">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Live Camera Feed"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">Waiting for camera feed...</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
