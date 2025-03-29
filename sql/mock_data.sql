-- Create a test home with MAC address format
INSERT INTO user_homes (user_id, home_id, email)
VALUES ('user_2uo5j6ahQyHx9FZDIPa80IZYdCs', '00:1A:22:33:44:55', 'bluedragon0000@gmail.com');

-- Devices with UUIDv4-style IDs
INSERT INTO devices (id, home_id, name, type, location, mode, current_state, brightness, temperature) VALUES
-- Lights (UUIDv4 pattern: 8-4-4-4-12, using first 8 chars for simplicity)
('light_a1b2c3d4', '00:1A:22:33:44:55', 'Ambient Ceiling Light', 'light', 'Living Room', 'away', 'off', NULL, NULL),
('light_e5f6g7h8', '00:1A:22:33:44:55', 'Task Lighting', 'light', 'Kitchen', 'away', 'on', 80, 4000),
('light_i9j0k1l2', '00:1A:22:33:44:55', 'Pathway Light', 'light', 'Front Yard', 'away', 'on', 60, 3000),

-- Doors
('door_m3n4o5p6', '00:1A:22:33:44:55', 'Main Entry Sensor', 'door_sensor', 'Front Entrance', 'away', 'closed', NULL, NULL),
('door_q7r8s9t0', '00:1A:22:33:44:55', 'Patio Sensor', 'door_sensor', 'Back Patio', 'away', 'open', NULL, NULL),

-- Windows
('window_u1v2w3x4', '00:1A:22:33:44:55', 'Double Pane Sensor', 'window_sensor', 'Living Room', 'movie', 'closed', NULL, NULL),
('window_y5z6a7b8', '00:1A:22:33:44:55', 'Bay Window Sensor', 'window_sensor', 'Dining Room', 'learning', 'closed', NULL, NULL),
('window_c9d0e1f2', '00:1A:22:33:44:55', 'Basement Egress Sensor', 'window_sensor', 'Basement', 'sleep', 'open', NULL, NULL),
('window_g3h4i5j6', '00:1A:22:33:44:55', 'Transom Sensor', 'window_sensor', 'Entryway', 'away', 'closed', NULL, NULL);

-- Event Log (MAC address home_id)
INSERT INTO event_log (home_id, device_id, event_type, old_state, new_state, read, created_at) VALUES
('00:1A:22:33:44:55', 'light_a1b2c3d4', 'state_change', 'on', 'off', FALSE, NOW() - INTERVAL '15 minutes'),
('00:1A:22:33:44:55', 'door_m3n4o5p6', 'security_alert', 'closed', 'open_forced', FALSE, NOW() - INTERVAL '30 minutes'),
('00:1A:22:33:44:55', 'light_e5f6g7h8', 'mode_change', 'home', 'away', TRUE, NOW() - INTERVAL '1 hour'),
('00:1A:22:33:44:55', 'window_g3h4i5j6', 'state_change', 'closed', 'open', FALSE, NOW() - INTERVAL '2 hours'),
('00:1A:22:33:44:55', 'light_e5f6g7h8', 'state_change', 'on', 'offline', FALSE, NOW() - INTERVAL '3 hours'),
('00:1A:22:33:44:55', 'door_q7r8s9t0', 'security_alert', 'open', 'offline', FALSE, NOW() - INTERVAL '4 hours'),
('00:1A:22:33:44:55', 'window_y5z6a7b8', 'state_change', 'closed', 'offline', FALSE, NOW() - INTERVAL '5 hours'),
('00:1A:22:33:44:55', 'light_i9j0k1l2', 'mode_change', 'away', 'emergency', TRUE, NOW() - INTERVAL '6 hours'),
('00:1A:22:33:44:55', 'light_i9j0k1l2', 'state_change', 'off', 'on', FALSE, NOW() - INTERVAL '7 hours'),
('00:1A:22:33:44:55', 'window_c9d0e1f2', 'security_alert', 'open', 'tampered', FALSE, NOW() - INTERVAL '8 hours');

-- Alert Log (MAC address home_id)
INSERT INTO alert_log (home_id, user_id, device_id, message, sent_status, dismissed, created_at) VALUES
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'door_q7r8s9t0', 'Connection lost with patio door sensor', TRUE, FALSE, NOW() - INTERVAL '45 minutes'),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'window_c9d0e1f2', 'Tampering detected - Basement window sensor', FALSE, FALSE, NOW() - INTERVAL '2 hours'),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'light_e5f6g7h8', 'Home security system: Switching to Away mode', TRUE, FALSE, NOW() - INTERVAL '3 hours'),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'light_a1b2c3d4', 'Device offline - Living room light not responding', FALSE, FALSE, NOW() - INTERVAL '4 hours'),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'window_g3h4i5j6', 'Security Warning: Entryway window opened while system armed', TRUE, FALSE, NOW() - INTERVAL '5 hours'),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'light_i9j0k1l2', 'EMERGENCY: Smoke detected - Emergency lighting activated', TRUE, FALSE, NOW() - INTERVAL '6 hours'),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'door_m3n4o5p6', 'SECURITY BREACH: Front door forced open - Contacting authorities', TRUE, FALSE, NOW() - INTERVAL '7 hours'),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'window_y5z6a7b8', 'Connection lost with dining room window sensor', FALSE, FALSE, NOW() - INTERVAL '8 hours'),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'light_i9j0k1l2', 'Night security mode: Pathway light activated', TRUE, FALSE, NOW() - INTERVAL '9 hours'),
('00:1A:22:33:44:55', 'user_2uo5j6ahQyHx9FZDIPa80IZYdCs', 'light_e5f6g7h8', 'Low battery warning: Kitchen light (15% remaining)', TRUE, FALSE, NOW() - INTERVAL '10 hours');