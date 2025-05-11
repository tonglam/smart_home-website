"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CAMERA_TOPIC, PLACEHOLDER_IMAGE } from "@/lib/utils/defaults.util";
import {
  connectWss,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "@/lib/utils/wss.util";
import type { CameraMessage } from "@/types/dashboard.types";
import { Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function CameraFeed() {
  const [currentImageSrc, setCurrentImageSrc] =
    useState<string>(PLACEHOLDER_IMAGE);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isFeedActive, setIsFeedActive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const messageHandler = (topic: string, message: string) => {
      if (!isMounted) return;

      if (topic === CAMERA_TOPIC) {
        try {
          const parsedMessage: CameraMessage = JSON.parse(message);
          if (parsedMessage.image) {
            setCurrentImageSrc(`data:image/png;base64,${parsedMessage.image}`);
          } else {
            console.error(
              "[CameraFeed] Parsed message, but no image data found in 'image' field."
            );
          }
        } catch (e) {
          console.error(
            "[CameraFeed] Failed to parse camera message JSON:",
            e,
            "Raw message was:",
            message
          );
        }
      }
    };

    async function setupWssAndSubscribe() {
      try {
        const client = await connectWss();

        if (client && client.connected) {
          if (!isMounted) return;
          setIsConnected(true);
          const subscribed = await subscribeToTopic(
            CAMERA_TOPIC,
            messageHandler
          );
          if (!subscribed && isMounted) {
            console.error(
              "[CameraFeed] Failed to subscribe to camera feed topic."
            );
            setIsConnected(false);
          }
        } else {
          if (!isMounted) return;
          console.error(
            "[CameraFeed] Failed to connect to WSS. Client connected status:",
            client?.connected
          );
          setIsConnected(false);
        }
      } catch (e) {
        if (!isMounted) return;
        console.error("[CameraFeed] WSS Connection or Subscription error:", e);
        setIsConnected(false);
      }
    }

    if (isFeedActive) {
      setupWssAndSubscribe();
    } else {
      if (isMounted) {
        setCurrentImageSrc(PLACEHOLDER_IMAGE);
        setIsConnected(false);
      }
    }

    return () => {
      isMounted = false;

      unsubscribeFromTopic(CAMERA_TOPIC, messageHandler)
        .then((unsubscribed) => {
          if (unsubscribed) {
            console.error(
              "[CameraFeed] Cleaned up: Unsubscribed from camera topic:",
              CAMERA_TOPIC
            );
          }
        })
        .catch((e) => {
          console.error(
            "[CameraFeed] Cleaned up: Error unsubscribing from camera topic:",
            e
          );
        });
      if (isMounted) {
        setIsConnected(false);
      }
    };
  }, [isFeedActive]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Real-time Camera</h3>
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              <span>Camera</span>
            </div>
            <div className="flex items-center gap-3">
              {isFeedActive && isConnected && (
                <span className="text-sm text-green-500">Live</span>
              )}
              {isFeedActive && !isConnected && (
                <span className="text-sm text-yellow-500">Connecting...</span>
              )}
              {!isFeedActive && (
                <span className="text-sm text-gray-500">Idle</span>
              )}
              <Button
                className="text-sm bg-green-500 hover:bg-green-600"
                onClick={() => setIsFeedActive((prev) => !prev)}
              >
                {isFeedActive ? "Stop" : "Start"}
              </Button>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-video relative">
            <Image
              src={currentImageSrc}
              alt="Live Camera Feed"
              fill
              className="object-cover"
              priority={currentImageSrc !== PLACEHOLDER_IMAGE}
              unoptimized={currentImageSrc.startsWith("data:image")}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
