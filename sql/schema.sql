DROP TABLE IF EXISTS alert_log;
DROP TABLE IF EXISTS event_log;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS user_homes;

CREATE TABLE devices (
    id TEXT PRIMARY KEY,
    home_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    current_state TEXT NOT NULL,
    brightness INTEGER,
    temperature INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_homes (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,             
    home_id TEXT NOT NULL,             
    mode TEXT NOT NULL DEFAULT 'home',
    email TEXT NOT NULL,               
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, home_id)           
);

CREATE TABLE event_log (
    id SERIAL PRIMARY KEY,
    home_id TEXT NOT NULL,             
    device_id TEXT NOT NULL,
    event_type TEXT NOT NULL,          
    old_state TEXT,
    new_state TEXT,
    read BOOLEAN DEFAULT FALSE,        
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE alert_log (
    id SERIAL PRIMARY KEY,
    home_id TEXT NOT NULL,             
    user_id TEXT NOT NULL,             
    device_id TEXT,                    
    message TEXT NOT NULL,             
    sent_status BOOLEAN DEFAULT FALSE, 
    dismissed BOOLEAN DEFAULT FALSE,    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE INDEX idx_devices_home ON devices(home_id);
CREATE INDEX idx_user_homes_user ON user_homes(user_id);
CREATE INDEX idx_event_log_home ON event_log(home_id);
CREATE INDEX idx_alert_log_home ON alert_log(home_id);
CREATE INDEX idx_alert_log_user ON alert_log(user_id);
