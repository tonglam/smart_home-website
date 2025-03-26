"use client";

import {
  getLightingData,
  updateLightState,
  type Light,
} from "@/app/actions/lighting";
import { useEffect, useState } from "react";

export function useLighting(homeId: string) {
  const [lights, setLights] = useState<Light[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLightingData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getLightingData(homeId);
        setLights(data);
      } catch (error) {
        console.error("Error fetching lighting data:", error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLightingData();
  }, [homeId]);

  const toggleLight = async (id: string) => {
    const light = lights.find((l) => l.id === id);
    if (!light) return;

    const success = await updateLightState(id, homeId, {
      isOn: !light.isOn,
    });

    if (success) {
      setLights(
        lights.map((light) =>
          light.id === id ? { ...light, isOn: !light.isOn } : light
        )
      );
    }
  };

  const adjustBrightness = async (id: string, value: number) => {
    const light = lights.find((l) => l.id === id);
    if (!light) return;

    const success = await updateLightState(id, homeId, {
      brightness: value,
    });

    if (success) {
      setLights(
        lights.map((light) =>
          light.id === id ? { ...light, brightness: value } : light
        )
      );
    }
  };

  const adjustTemperature = async (id: string, value: number) => {
    const light = lights.find((l) => l.id === id);
    if (!light) return;

    const success = await updateLightState(id, homeId, {
      temperature: value,
    });

    if (success) {
      setLights(
        lights.map((light) =>
          light.id === id ? { ...light, temperature: value } : light
        )
      );
    }
  };

  return {
    lights,
    isLoading,
    error,
    toggleLight,
    adjustBrightness,
    adjustTemperature,
  };
}
