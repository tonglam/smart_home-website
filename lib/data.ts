// Mock data for the Smart Home application

// Notifications
export const notifications = [
  { id: 1, title: 'Motion Detected', message: 'Front door camera detected movement', time: '2 mins ago' },
  { id: 2, title: 'Temperature Alert', message: 'Living room is above target temperature', time: '15 mins ago' },
  { id: 3, title: 'Device Update', message: 'Smart thermostat firmware update available', time: '1 hour ago' }
];

// Security points
export const securityPoints = [
  { id: '1', name: 'Front Door', type: 'door', status: 'closed', lastActivity: '2 mins ago' },
  { id: '2', name: 'Back Door', type: 'door', status: 'closed', lastActivity: '15 mins ago' },
  { id: '3', name: 'Kitchen Window', type: 'window', status: 'closed', lastActivity: '1 hour ago' },
  { id: '4', name: 'Living Room Window', type: 'window', status: 'open', lastActivity: 'Just now' }
];

// Lighting states
export const defaultLights = [
  { id: '1', name: 'Main Light', isOn: false, brightness: 100, temperature: 4600, room: 'Living Room' },
  { id: '2', name: 'Desk Light', isOn: true, brightness: 90, temperature: 6500, room: 'Study' }
];

// Automation modes
export const defaultAutomationModes = [
  {
    id: 'away',
    name: 'Away Mode',
    icon: 'Home',
    active: false,
    description: 'Secure your home when you\'re away'
  },
  {
    id: 'movie',
    name: 'Movie Mode',
    icon: 'Film',
    active: false,
    description: 'Perfect lighting for movie time'
  },
  {
    id: 'learning',
    name: 'Learning Mode',
    icon: 'BookOpen',
    active: false,
    description: 'Optimal settings for study and focus'
  }
];

// Recent activities
export const recentActivities = [
  { time: '10:30 AM', activity: 'Living Room lights turned on' },
  { time: '10:15 AM', activity: 'Temperature adjusted to 72°F' },
  { time: '10:00 AM', activity: 'Security system armed' }
];