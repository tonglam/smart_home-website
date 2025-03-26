-- Drop existing tables if they exist
DROP TABLE IF EXISTS alert_log;
DROP TABLE IF EXISTS event_log;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS user_homes;

-- Updated Device Registry with Home Grouping
CREATE TABLE devices (
    id TEXT PRIMARY KEY,               -- Device UUID
    home_id TEXT NOT NULL,             -- From external user system
    name TEXT NOT NULL,                -- "Bedroom Main Light"
    type TEXT NOT NULL,                -- 'light'/'door_sensor'/'camera'/'window_sensor'
    location TEXT,                     -- "Living Room", "Front Door"
    mode TEXT,                         -- Formerly from device_states
    current_state TEXT NOT NULL,       -- 'on'/'off'/'open'/'closed'
    created_at DATETIME DEFAULT (datetime('now')),
    last_updated DATETIME DEFAULT (datetime('now'))
);

-- User-Home Relationship Management
CREATE TABLE user_homes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,             -- External user system ID
    home_id TEXT NOT NULL,             -- Home identifier
    email TEXT NOT NULL,               -- User's email for notifications
    created_at DATETIME DEFAULT (datetime('now')),
    UNIQUE(user_id, home_id)           -- Prevent duplicate user-home relationships
);

-- Updated Event Logging
CREATE TABLE event_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    home_id TEXT NOT NULL,             -- Reference to home group
    device_id TEXT NOT NULL,
    event_type TEXT NOT NULL,          -- 'state_change'/'security_alert'/'mode_change'
    old_state TEXT,
    new_state TEXT,
    created_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

-- Updated Alert Tracking
CREATE TABLE alert_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    home_id TEXT NOT NULL,             -- Reference to home group
    user_id TEXT NOT NULL,             -- User who should receive the alert
    device_id TEXT,                    -- Optional device reference
    message TEXT NOT NULL,             -- "Front door opened during leave mode"
    sent_status INTEGER DEFAULT 0,     -- Using INTEGER instead of BOOLEAN (0/1)
    created_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

-- New Indexes for Home-based queries
CREATE INDEX idx_devices_home ON devices(home_id);
CREATE INDEX idx_user_homes_user ON user_homes(user_id);
CREATE INDEX idx_event_log_home ON event_log(home_id);
CREATE INDEX idx_alert_log_home ON alert_log(home_id);
CREATE INDEX idx_alert_log_user ON alert_log(user_id);
