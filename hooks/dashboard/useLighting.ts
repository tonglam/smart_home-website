"use client";

import { updateLightState } from "@/app/actions/dashboard/lighting.action";
import type { Light } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

export function useLighting(homeId: string, initialLights: Light[] = []) {
  const [lights, setLights] = useState<Light[]>(initialLights);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  const toggleLight = async (id: string) => {
    const light = lights.find((l) => l.id === id);
    if (!light) {
      toast.error("Light device not found");
      return;
    }

    if (pendingUpdates.has(id)) {
      return;
    }

    try {
      setPendingUpdates((prev) => new Set(prev).add(id));

      setLights(lights.map((l) => (l.id === id ? { ...l, isOn: !l.isOn } : l)));

      const success = await updateLightState(id, homeId, {
        currentState: light.isOn ? "off" : "on",
      });

      if (!success) {
        setLights(
          lights.map((l) => (l.id === id ? { ...l, isOn: light.isOn } : l))
        );
        toast.error("Failed to update light state");
      } else {
        toast.success(`${light.name} toggled successfully.`);
      }
    } catch (error) {
      setLights(
        lights.map((l) => (l.id === id ? { ...l, isOn: light.isOn } : l))
      );
      toast.error("Error updating light state");
    } finally {
      setPendingUpdates((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const adjustBrightness = async (id: string, value: number) => {
    const light = lights.find((l) => l.id === id);
    if (!light) {
      toast.error("Light device not found");
      return;
    }

    const newBrightness = Math.max(0, Math.min(100, Math.round(value)));

    if (light.brightness === newBrightness || pendingUpdates.has(id)) {
      return;
    }

    const originalBrightness = light.brightness;

    try {
      setPendingUpdates((prev) => new Set(prev).add(id));

      setLights(
        lights.map((l) =>
          l.id === id ? { ...l, brightness: newBrightness } : l
        )
      );

      const success = await updateLightState(id, homeId, {
        brightness: newBrightness,
      });

      if (!success) {
        setLights(
          lights.map((l) =>
            l.id === id ? { ...l, brightness: originalBrightness } : l
          )
        );
        toast.error(`Failed to update brightness for ${light.name}`);
      } else {
        toast.success(`Brightness updated for ${light.name}`);
      }
    } catch (error) {
      setLights(
        lights.map((l) =>
          l.id === id ? { ...l, brightness: originalBrightness } : l
        )
      );
      toast.error(`Error updating brightness for ${light.name}`);
    } finally {
      setPendingUpdates((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const adjustTemperature = async (id: string, value: number) => {
    const light = lights.find((l) => l.id === id);
    if (!light) {
      toast.error("Light device not found");
      return;
    }

    const newTemperature = Math.max(2700, Math.min(6500, Math.round(value)));

    if (light.temperature === newTemperature || pendingUpdates.has(id)) {
      return;
    }

    const originalTemperature = light.temperature;

    try {
      setPendingUpdates((prev) => new Set(prev).add(id));

      setLights(
        lights.map((l) =>
          l.id === id ? { ...l, temperature: newTemperature } : l
        )
      );

      const success = await updateLightState(id, homeId, {
        temperature: newTemperature,
      });

      if (!success) {
        setLights(
          lights.map((l) =>
            l.id === id ? { ...l, temperature: originalTemperature } : l
          )
        );
        toast.error(`Failed to update temperature for ${light.name}`);
      } else {
        toast.success(`Temperature updated for ${light.name}`);
      }
    } catch (error) {
      setLights(
        lights.map((l) =>
          l.id === id ? { ...l, temperature: originalTemperature } : l
        )
      );
      toast.error(`Error updating temperature for ${light.name}`);
    } finally {
      setPendingUpdates((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return {
    lights,
    toggleLight,
    adjustBrightness,
    adjustTemperature,
    pendingUpdates: Array.from(pendingUpdates),
  };
}
