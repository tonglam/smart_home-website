"use client";

import { updateCameraState } from "@/app/actions/dashboard/camera.action";
import type { Camera } from "@/types"; // Assuming Camera type is in @/types
import { useState } from "react";
import { toast } from "sonner";

export function useCamera(homeId: string, initialCameras: Camera[] = []) {
  const [cameras, setCameras] = useState<Camera[]>(initialCameras);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  const toggleCamera = async (id: string) => {
    const camera = cameras.find((c) => c.id === id);
    if (!camera) {
      toast.error("Camera device not found");
      return;
    }

    if (pendingUpdates.has(id)) {
      toast.info(`Update already in progress for ${camera.name}`);
      return;
    }

    const originalStatus = camera.status; // e.g., "online" or "offline"
    const newStatus: "online" | "offline" =
      originalStatus === "online" ? "offline" : "online";

    try {
      setPendingUpdates((prev) => new Set(prev).add(id));
      // Optimistic update
      setCameras(
        cameras.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );

      const success = await updateCameraState(id, homeId, {
        currentState: newStatus, // Pass "online" or "offline"
      });

      if (!success) {
        // Revert optimistic update
        setCameras(
          cameras.map((c) =>
            c.id === id ? { ...c, status: originalStatus } : c
          )
        );
        toast.error(`Failed to toggle ${camera.name} to ${newStatus}`);
      } else {
        toast.success(`${camera.name} is now ${newStatus}.`);
      }
    } catch (error) {
      // Revert optimistic update on error
      setCameras(
        cameras.map((c) => (c.id === id ? { ...c, status: originalStatus } : c))
      );
      console.error("Error toggling camera:", error);
      toast.error(`Error toggling ${camera.name}. Please try again.`);
    } finally {
      setPendingUpdates((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return {
    cameras, // The current state of the cameras
    toggleCamera,
    pendingUpdates: Array.from(pendingUpdates), // Expose pending updates if needed by UI
  };
}
