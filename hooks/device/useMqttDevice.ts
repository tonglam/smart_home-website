"use client";

import { Device } from "@/lib/db";
import { publishDeviceState, sendDeviceCommand } from "@/lib/mqtt.device";
import { useCallback, useEffect, useState } from "react";

interface UseMqttDeviceProps {
  device: Device;
}

interface DeviceStateUpdate {
  current_state: string;
  [key: string]: string | undefined;
}

export function useMqttDevice({ device }: UseMqttDeviceProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Publish current device state to MQTT
  const publishState = useCallback(async () => {
    try {
      setIsSending(true);
      setError(null);
      const success = await publishDeviceState(device);
      setIsConnected(success);
      if (!success) {
        setError("Failed to publish device state");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsConnected(false);
    } finally {
      setIsSending(false);
    }
  }, [device]);

  // Send command to device via MQTT
  const sendCommand = useCallback(
    async (
      command: string,
      parameters?: Record<string, unknown>
    ): Promise<boolean> => {
      try {
        setIsSending(true);
        setError(null);
        const success = await sendDeviceCommand(
          device.home_id,
          device.id,
          command,
          parameters
        );
        if (!success) {
          setError("Failed to send command to device");
        }
        return success;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [device]
  );

  // Update device state and publish to MQTT
  const updateDeviceState = useCallback(
    async (updates: DeviceStateUpdate): Promise<boolean> => {
      try {
        // This is placeholder. In a real app, you would:
        // 1. Call an API to update the device in the database
        // 2. Then publish the new state to MQTT

        // For this example, we'll just simulate publishing the updated state
        const updatedDevice = {
          ...device,
          ...updates,
        };

        setIsSending(true);
        setError(null);
        const success = await publishDeviceState(updatedDevice);
        if (!success) {
          setError("Failed to update device state");
        }
        return success;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [device]
  );

  // Publish state when device updates
  useEffect(() => {
    publishState();
  }, [device, publishState]);

  return {
    isConnected,
    isSending,
    error,
    publishState,
    sendCommand,
    updateDeviceState,
  };
}
