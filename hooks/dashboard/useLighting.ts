"use client";

import { getLightingData, type Light } from "@/app/actions/lighting";
import { useEffect, useState } from "react";

export function useLighting() {
  const [lights, setLights] = useState<Light[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLightingData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getLightingData();
        setLights(data);
      } catch (error) {
        console.error("Error fetching lighting data:", error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLightingData();
  }, []);

  const toggleLight = (id: string) => {
    setLights(
      lights.map((light) =>
        light.id === id ? { ...light, isOn: !light.isOn } : light
      )
    );
  };

  const adjustBrightness = (id: string, value: number) => {
    setLights(
      lights.map((light) =>
        light.id === id ? { ...light, brightness: value } : light
      )
    );
  };

  const adjustTemperature = (id: string, value: number) => {
    setLights(
      lights.map((light) =>
        light.id === id ? { ...light, temperature: value } : light
      )
    );
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
