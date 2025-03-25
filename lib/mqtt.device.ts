import { Device } from "./db";
import { publishMessage, subscribeToTopic } from "./mqtt";

// Topic naming conventions
const getDeviceStateTopic = (homeId: string, deviceId: string) =>
  `home/${homeId}/device/${deviceId}/state`;
const getDeviceCommandTopic = (homeId: string, deviceId: string) =>
  `home/${homeId}/device/${deviceId}/command`;
const getHomeDevicesTopic = (homeId: string) => `home/${homeId}/devices`;

// Device state interface
interface DeviceState {
  id: string;
  name: string;
  type: string;
  state: string;
  location?: string;
  mode?: string;
  timestamp: string;
}

// Publish device state to MQTT
export async function publishDeviceState(device: Device): Promise<boolean> {
  try {
    const topic = getDeviceStateTopic(device.home_id, device.id);
    const message = {
      id: device.id,
      name: device.name,
      type: device.type,
      state: device.current_state,
      location: device.location,
      mode: device.mode,
      timestamp: new Date().toISOString(),
    };

    return await publishMessage(topic, message);
  } catch (error) {
    console.error(
      `Error publishing device state: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return false;
  }
}

// Send a command to a device via MQTT
export async function sendDeviceCommand(
  homeId: string,
  deviceId: string,
  command: string,
  parameters?: Record<string, unknown>
): Promise<boolean> {
  try {
    const topic = getDeviceCommandTopic(homeId, deviceId);
    const message = {
      command,
      parameters: parameters || {},
      timestamp: new Date().toISOString(),
    };

    return await publishMessage(topic, message);
  } catch (error) {
    console.error(
      `Error sending device command: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return false;
  }
}

// Listen for device state changes
export async function listenForDeviceStateChanges(
  homeId: string,
  deviceId: string,
  callback: (state: DeviceState) => void
): Promise<boolean> {
  try {
    const topic = getDeviceStateTopic(homeId, deviceId);

    return await subscribeToTopic(topic, (_, message) => {
      try {
        const stateData = JSON.parse(message) as DeviceState;
        callback(stateData);
      } catch (error) {
        console.error(
          `Error parsing device state: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    });
  } catch (error) {
    console.error(
      `Error subscribing to device state: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return false;
  }
}

// Listen for commands to a device
export async function listenForDeviceCommands(
  homeId: string,
  deviceId: string,
  callback: (command: string, parameters?: Record<string, unknown>) => void
): Promise<boolean> {
  try {
    const topic = getDeviceCommandTopic(homeId, deviceId);

    return await subscribeToTopic(topic, (_, message) => {
      try {
        const commandData = JSON.parse(message);
        callback(commandData.command, commandData.parameters);
      } catch (error) {
        console.error(
          `Error parsing device command: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    });
  } catch (error) {
    console.error(
      `Error subscribing to device commands: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return false;
  }
}

// Publish a device list update
export async function publishHomeDevices(
  homeId: string,
  devices: Device[]
): Promise<boolean> {
  try {
    const topic = getHomeDevicesTopic(homeId);
    const deviceList = devices.map((device) => ({
      id: device.id,
      name: device.name,
      type: device.type,
      state: device.current_state,
      location: device.location,
    }));

    return await publishMessage(topic, {
      devices: deviceList,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      `Error publishing home devices: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return false;
  }
}
