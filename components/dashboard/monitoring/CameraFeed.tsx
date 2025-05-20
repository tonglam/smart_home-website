"use client";

import { getCameraStatusAction } from "@/app/actions/camera/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CAMERA_TOPIC, PLACEHOLDER_IMAGE } from "@/lib/utils/defaults.util";
import {
  connectWss,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "@/lib/utils/wss.util";
import type { CameraMessage } from "@/types/dashboard.types";
import { Loader2, Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CameraFeedProps {
  homeId: string;
}

export function CameraFeed({ homeId }: CameraFeedProps) {
  const [currentImageSrc, setCurrentImageSrc] =
    useState<string>(PLACEHOLDER_IMAGE);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isFeedActive, setIsFeedActive] = useState<boolean>(false);
  const [isCameraOfflinePromptOpen, setIsCameraOfflinePromptOpen] =
    useState<boolean>(false);
  const [isCheckingCameraStatus, setIsCheckingCameraStatus] =
    useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const messageHandler = (topic: string, message: string) => {
      if (!isMounted) return;

      if (topic === CAMERA_TOPIC) {
        try {
          const parsedMessage: CameraMessage = JSON.parse(message);
          if (parsedMessage.image_b64) {
            setCurrentImageSrc(
              `data:image/png;base64,${parsedMessage.image_b64}`
            );
          } else {
            console.error(
              "[CameraFeed] Parsed message, but no image data found in 'image_b64' field."
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
      if (!isMounted) return;
      setIsConnected(false); // Reset connection status
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
            toast.error("Failed to subscribe to camera feed.");
            setIsConnected(false);
            setIsFeedActive(false);
          }
        } else {
          if (!isMounted) return;
          console.error(
            "[CameraFeed] Failed to connect to WSS. Client connected status:",
            client?.connected
          );
          toast.error("Failed to connect to live feed service.");
          setIsConnected(false);
          setIsFeedActive(false);
        }
      } catch (e) {
        if (!isMounted) return;
        console.error("[CameraFeed] WSS Connection or Subscription error:", e);
        toast.error("Error connecting to live feed. Please try again.");
        setIsConnected(false);
        setIsFeedActive(false);
      }
    }

    if (isFeedActive) {
      setupWssAndSubscribe();
    } else {
      if (isMounted) {
        setCurrentImageSrc(PLACEHOLDER_IMAGE);
        setIsConnected(false);
        unsubscribeFromTopic(CAMERA_TOPIC, messageHandler)
          .then((unsubscribed) => {
            if (unsubscribed) {
              console.log(
                "[CameraFeed] Unsubscribed from camera topic on stop feed:",
                CAMERA_TOPIC
              );
            }
          })
          .catch((e) => {
            console.error(
              "[CameraFeed] Error unsubscribing from camera topic on stop feed:",
              e
            );
          });
      }
    }

    return () => {
      isMounted = false;
      unsubscribeFromTopic(CAMERA_TOPIC, messageHandler)
        .then((unsubscribed) => {
          if (unsubscribed) {
            console.log(
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
    };
  }, [isFeedActive]);

  const handleStartFeedAttempt = async () => {
    if (!homeId) {
      toast.error("Home ID is missing. Cannot check camera status.");
      return;
    }
    setIsCheckingCameraStatus(true);
    try {
      const result = await getCameraStatusAction(homeId);
      if (result.success && result.data) {
        if (result.data.currentState === "online") {
          setIsFeedActive(true);
        } else {
          toast.info(
            `Camera is currently ${result.data.currentState || "offline"}. Please ensure it's online.`
          );
          setIsCameraOfflinePromptOpen(true);
        }
      } else {
        toast.error(
          result.error || result.message || "Failed to get camera status."
        );
      }
    } catch (error) {
      console.error("[CameraFeed] Error checking camera status:", error);
      toast.error("An unexpected error occurred while checking camera status.");
    }
    setIsCheckingCameraStatus(false);
  };

  const handleStopFeed = () => {
    setIsFeedActive(false);
  };

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
              {isFeedActive && !isConnected && !isCheckingCameraStatus && (
                <span className="text-sm text-yellow-500">Connecting...</span>
              )}
              {!isFeedActive && !isCheckingCameraStatus && (
                <span className="text-sm text-gray-500">Idle</span>
              )}
              {isCheckingCameraStatus && (
                <span className="text-sm text-blue-500 flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </span>
              )}
              <Button
                className={`text-sm ${isFeedActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                onClick={isFeedActive ? handleStopFeed : handleStartFeedAttempt}
                disabled={isCheckingCameraStatus}
              >
                {isCheckingCameraStatus && !isFeedActive ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
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

      <AlertDialog
        open={isCameraOfflinePromptOpen}
        onOpenChange={setIsCameraOfflinePromptOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Camera Offline</AlertDialogTitle>
            <AlertDialogDescription>
              The camera appears to be offline or not reporting an 'online'
              status. Please check your camera's connection and ensure it is
              powered on and connected to the network.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setIsCameraOfflinePromptOpen(false)}
            >
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
