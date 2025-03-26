-- Create a test home with MAC address format
INSERT INTO user_homes (user_id, home_id, email)
VALUES ('user_2uo5j6ahQyHx9FZDIPa80IZYdCs', '00:1A:22:33:44:55', 'bluedragon0000@gmail.com');

-- Devices with UUIDv4-style IDs
INSERT INTO devices (id, home_id, name, type, location, mode, current_state) VALUES
-- Lights (UUIDv4 pattern: 8-4-4-4-12, using first 8 chars for simplicity)
('light_a1b2c3d4', '00:1A:22:33:44:55', 'Ambient Ceiling Light', 'light', 'Living Room', 'away', 'off'),
('light_e5f6g7h8', '00:1A:22:33:44:55', 'Task Lighting', 'light', 'Kitchen', 'away', 'on'),
('light_i9j0k1l2', '00:1A:22:33:44:55', 'Pathway Light', 'light', 'Front Yard', 'away', 'on'),

-- Doors
('door_m3n4o5p6', '00:1A:22:33:44:55', 'Main Entry Sensor', 'door_sensor', 'Front Entrance', 'away', 'closed'),
('door_q7r8s9t0', '00:1A:22:33:44:55', 'Patio Sensor', 'door_sensor', 'Back Patio', 'away', 'open'),

-- Windows
('window_u1v2w3x4', '00:1A:22:33:44:55', 'Double Pane Sensor', 'window_sensor', 'Living Room', 'movie', 'closed'),
('window_y5z6a7b8', '00:1A:22:33:44:55', 'Bay Window Sensor', 'window_sensor', 'Dining Room', 'learning', 'closed'),
('window_c9d0e1f2', '00:1A:22:33:44:55', 'Basement Egress Sensor', 'window_sensor', 'Basement', 'sleep', 'open'),
('window_g3h4i5j6', '00:1A:22:33:44:55', 'Transom Sensor', 'window_sensor', 'Entryway', 'away', 'closed');

-- Event Log (MAC address home_id)
INSERT INTO event_log (home_id, device_id, event_type, old_state, new_state, created_at) VALUES
('00:1A:22:33:44:55', 'light_a1b2c3d4', 'state_change', 'on', 'off', datetime('now', '-15 minutes')),
('00:1A:22:33:44:55', 'door_m3n4o5p6', 'security_alert', 'closed', 'open_forced', datetime('now', '-30 minutes')),
('00:1A:22:33:44:55', 'light_e5f6g7h8', 'mode_change', 'home', 'away', datetime('now', '-1 hour')),
('00:1A:22:33:44:55', 'window_g3h4i5j6', 'state_change', 'closed', 'open', datetime('now', '-2 hours')),
('00:1A:22:33:44:55', 'light_e5f6g7h8', 'state_change', 'on', 'offline', datetime('now', '-3 hours')),
('00:1A:22:33:44:55', 'door_q7r8s9t0', 'security_alert', 'open', 'offline', datetime('now', '-4 hours')),
('00:1A:22:33:44:55', 'window_y5z6a7b8', 'state_change', 'closed', 'offline', datetime('now', '-5 hours')),
('00:1A:22:33:44:55', 'light_i9j0k1l2', 'mode_change', 'away', 'emergency', datetime('now', '-6 hours')),
('00:1A:22:33:44:55', 'light_i9j0k1l2', 'state_change', 'off', 'on', datetime('now', '-7 hours')),
('00:1A:22:33:44:55', 'window_c9d0e1f2', 'security_alert', 'open', 'tampered', datetime('now', '-8 hours'));

-- Alert Log (MAC address home_id)
INSERT INTO alert_log (home_id, user_id, device_id, message, sent_status, dismissed, created_at) VALUES
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'door_q7r8s9t0', 'Connection lost with patio door sensor', 1, 0, datetime('now', '-45 minutes')),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'window_c9d0e1f2', 'Tampering detected - Basement window sensor', 0, 0, datetime('now', '-2 hours')),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'light_e5f6g7h8', 'Home security system: Switching to Away mode', 1, 0, datetime('now', '-3 hours')),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'light_a1b2c3d4', 'Device offline - Living room light not responding', 0, 0, datetime('now', '-4 hours')),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'window_g3h4i5j6', 'Security Warning: Entryway window opened while system armed', 1, 0, datetime('now', '-5 hours')),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'light_i9j0k1l2', 'EMERGENCY: Smoke detected - Emergency lighting activated', 1, 0, datetime('now', '-6 hours')),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'door_m3n4o5p6', 'SECURITY BREACH: Front door forced open - Contacting authorities', 1, 0, datetime('now', '-7 hours')),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'window_y5z6a7b8', 'Connection lost with dining room window sensor', 0, 0, datetime('now', '-8 hours')),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'light_i9j0k1l2', 'Night security mode: Pathway light activated', 1, 0, datetime('now', '-9 hours')),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'light_e5f6g7h8', 'Low battery warning: Kitchen light (15% remaining)', 1, 0, datetime('now', '-10 hours'));