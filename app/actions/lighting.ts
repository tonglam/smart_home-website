"use server";

import * as db from "@/lib/db";
import {
  DEFAULT_BRIGHTNESS,
  DEFAULT_TEMPERATURE,
} from "@/lib/utils/defaults.util";

export type Light = {
  id: string;
  name: string;
  isOn: boolean;
  brightness: number;
  temperature: number;
  room: string;
};

interface LightState {
  isOn: boolean;
  brightness: number;
  temperature: number;
}

const parseDeviceState = (stateString: string | null): LightState => {
  // Handle null/undefined state
  if (!stateString) {
    return {
      isOn: false,
      brightness: DEFAULT_BRIGHTNESS,
      temperature: DEFAULT_TEMPERATURE,
    };
  }

  // First try to handle simple on/off string state
  if (
    stateString.toLowerCase() === "on" ||
    stateString.toLowerCase() === "off"
  ) {
    return {
      isOn: stateString.toLowerCase() === "on",
      brightness: DEFAULT_BRIGHTNESS,
      temperature: DEFAULT_TEMPERATURE,
    };
  }

  // Then try to parse as JSON for more complex state
  try {
    const state = JSON.parse(stateString);
    return {
      isOn: typeof state.isOn === "boolean" ? state.isOn : state.isOn === "on",
      brightness: Number(state.brightness) || DEFAULT_BRIGHTNESS,
      temperature: Number(state.temperature) || DEFAULT_TEMPERATURE,
    };
  } catch (error) {
    // If JSON parsing fails, default to treating the string as the on/off state
    console.error("Error parsing device state:", error);
    return {
      isOn: stateString.toLowerCase() === "on",
      brightness: DEFAULT_BRIGHTNESS,
      temperature: DEFAULT_TEMPERATURE,
    };
  }
};

export async function getLightingData(homeId: string): Promise<Light[]> {
  try {
    const devices = await db.getDevices(homeId);
    const lights = devices.filter((device) => device.type === "light");

    return lights.map((light) => {
      const state = parseDeviceState(light.current_state);

      return {
        id: light.id,
        name: light.name,
        isOn: state.isOn,
        brightness: state.brightness,
        temperature: state.temperature,
        room: light.location || "Unknown",
      };
    });
  } catch (error) {
    console.error("Error fetching lighting data:", error);
    return [];
  }
}

export async function updateLightState(
  deviceId: string,
  homeId: string,
  updates: Partial<LightState>
): Promise<boolean> {
  try {
    const device = await db.getDeviceById(deviceId);
    if (!device || device.home_id !== homeId || device.type !== "light") {
      return false;
    }

    // For simple on/off updates, just store as string
    if (Object.keys(updates).length === 1 && "isOn" in updates) {
      await db.updateDevice(deviceId, {
        current_state: updates.isOn ? "on" : "off",
      });
    } else {
      // For complex updates with brightness/temperature, store as JSON
      const currentState = parseDeviceState(device.current_state);
      const newState = { ...currentState, ...updates };
      await db.updateDevice(deviceId, {
        current_state: JSON.stringify(newState),
      });
    }

    // Log the event
    await db.logEvent({
      home_id: homeId,
      device_id: deviceId,
      event_type: "light_state_changed",
      old_state: device.current_state,
      new_state: updates.isOn ? "on" : "off",
    });

    return true;
  } catch (error) {
    console.error("Error updating light state:", error);
    return false;
  }
}
