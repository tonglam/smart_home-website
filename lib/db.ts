// Types based on schema
export type Device = {
  id: string;
  home_id: string;
  name: string;
  type: string;
  location?: string;
  mode?: string;
  current_state: string;
  created_at?: string;
  last_updated?: string;
};

export type EventLog = {
  id?: number;
  home_id: string;
  device_id: string;
  event_type: string;
  old_state?: string;
  new_state?: string;
  create_at?: string;
};

export type AlertLog = {
  id?: number;
  home_id: string;
  device_id?: string;
  message: string;
  sent_status?: number;
  triggered_at?: string;
  created_at?: string;
};

// Simple error logger
function logError(error: unknown, context: string): void {
  if (error instanceof Error) {
    console.error(`${context}: ${error.message}`);
  } else {
    console.error(`${context}: Unknown error`, error);
  }
}

// Execute D1 query via REST API
async function executeD1Query<T = unknown>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const config = {
    apiToken: process.env.CF_API_TOKEN,
    accountId: process.env.CF_ACCOUNT_ID,
    databaseId: process.env.CF_DATABASE_ID,
  };

  // Validate configuration
  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `D1 API Error: ${error.errors?.[0]?.message || "Unknown error"}`
    );
  }

  const result = await response.json();
  return result.result || [];
}

// Device Operations
export async function getDevices(homeId: string): Promise<Device[]> {
  try {
    return await executeD1Query<Device>(
      "SELECT * FROM devices WHERE home_id = ?",
      [homeId]
    );
  } catch (error) {
    logError(error, "Error fetching devices");
    return [];
  }
}

export async function getDeviceById(deviceId: string): Promise<Device | null> {
  try {
    const results = await executeD1Query<Device>(
      "SELECT * FROM devices WHERE id = ?",
      [deviceId]
    );
    return results[0] || null;
  } catch (error) {
    logError(error, "Error fetching device");
    return null;
  }
}

export async function createDevice(
  device: Omit<Device, "created_at" | "last_updated">
): Promise<{ success: boolean; id?: string }> {
  try {
    await executeD1Query(
      `INSERT INTO devices (id, home_id, name, type, location, mode, current_state)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        device.id,
        device.home_id,
        device.name,
        device.type,
        device.location || null,
        device.mode || null,
        device.current_state,
      ]
    );
    return { success: true, id: device.id };
  } catch (error) {
    logError(error, "Error creating device");
    return { success: false };
  }
}

export async function updateDevice(
  deviceId: string,
  updates: Partial<Device>
): Promise<{ success: boolean }> {
  try {
    const updateFields: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(updates)) {
      if (key !== "id" && key !== "created_at") {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    }

    updateFields.push("last_updated = datetime('now')");
    values.push(deviceId);

    const query = `UPDATE devices SET ${updateFields.join(", ")} WHERE id = ?`;
    await executeD1Query(query, values);

    return { success: true };
  } catch (error) {
    logError(error, "Error updating device");
    return { success: false };
  }
}

export async function deleteDevice(
  deviceId: string
): Promise<{ success: boolean }> {
  try {
    await executeD1Query("DELETE FROM devices WHERE id = ?", [deviceId]);
    return { success: true };
  } catch (error) {
    logError(error, "Error deleting device");
    return { success: false };
  }
}

// Event Log Operations
export async function logEvent(
  event: Omit<EventLog, "id" | "create_at">
): Promise<{ success: boolean; id?: number }> {
  try {
    const results = await executeD1Query<{ id: number }>(
      `INSERT INTO event_log (home_id, device_id, event_type, old_state, new_state)
       VALUES (?, ?, ?, ?, ?)
       RETURNING id`,
      [
        event.home_id,
        event.device_id,
        event.event_type,
        event.old_state || null,
        event.new_state || null,
      ]
    );

    return {
      success: true,
      id: results[0]?.id,
    };
  } catch (error) {
    logError(error, "Error logging event");
    return { success: false };
  }
}

export async function getEvents(
  homeId: string,
  limit = 50
): Promise<EventLog[]> {
  try {
    return await executeD1Query<EventLog>(
      "SELECT * FROM event_log WHERE home_id = ? ORDER BY create_at DESC LIMIT ?",
      [homeId, limit]
    );
  } catch (error) {
    logError(error, "Error fetching events");
    return [];
  }
}

export async function getDeviceEvents(
  deviceId: string,
  limit = 20
): Promise<EventLog[]> {
  try {
    return await executeD1Query<EventLog>(
      "SELECT * FROM event_log WHERE device_id = ? ORDER BY create_at DESC LIMIT ?",
      [deviceId, limit]
    );
  } catch (error) {
    logError(error, "Error fetching device events");
    return [];
  }
}

// Alert Log Operations
export async function createAlert(
  alert: Omit<AlertLog, "id" | "triggered_at" | "created_at">
): Promise<{ success: boolean; id?: number }> {
  try {
    const results = await executeD1Query<{ id: number }>(
      `INSERT INTO alert_log (home_id, device_id, message, sent_status)
       VALUES (?, ?, ?, ?)
       RETURNING id`,
      [
        alert.home_id,
        alert.device_id || null,
        alert.message,
        alert.sent_status || 0,
      ]
    );

    return {
      success: true,
      id: results[0]?.id,
    };
  } catch (error) {
    logError(error, "Error creating alert");
    return { success: false };
  }
}

export async function getAlerts(
  homeId: string,
  limit = 50
): Promise<AlertLog[]> {
  try {
    return await executeD1Query<AlertLog>(
      "SELECT * FROM alert_log WHERE home_id = ? ORDER BY triggered_at DESC LIMIT ?",
      [homeId, limit]
    );
  } catch (error) {
    logError(error, "Error fetching alerts");
    return [];
  }
}

export async function updateAlertStatus(
  alertId: number,
  sentStatus: number
): Promise<{ success: boolean }> {
  try {
    await executeD1Query("UPDATE alert_log SET sent_status = ? WHERE id = ?", [
      sentStatus,
      alertId,
    ]);
    return { success: true };
  } catch (error) {
    logError(error, "Error updating alert status");
    return { success: false };
  }
}
