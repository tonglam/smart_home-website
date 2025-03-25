// Mock data for the Analytics dashboard charts

// Energy consumption data (daily for a week)
export const energyConsumptionData = [
  { day: 'Mon', consumption: 5.2, cost: 1.56 },
  { day: 'Tue', consumption: 6.1, cost: 1.83 },
  { day: 'Wed', consumption: 4.8, cost: 1.44 },
  { day: 'Thu', consumption: 5.5, cost: 1.65 },
  { day: 'Fri', consumption: 7.2, cost: 2.16 },
  { day: 'Sat', consumption: 8.3, cost: 2.49 },
  { day: 'Sun', consumption: 6.7, cost: 2.01 },
];

// Device usage data
export const deviceUsageData = [
  { name: 'Living Room Lights', usage: 38 },
  { name: 'Thermostat', usage: 27 },
  { name: 'Smart TV', usage: 18 },
  { name: 'Security Cameras', usage: 12 },
  { name: 'Smart Speaker', usage: 5 },
];

// Device mode usage data
export const deviceModeUsageData = [
  { name: 'Away Mode', value: 35 },
  { name: 'Movie Mode', value: 25 },
  { name: 'Learning Mode', value: 20 },
  { name: 'Sleep Mode', value: 15 },
  { name: 'Custom Mode', value: 5 },
];

// Temperature data by room (past 24 hours)
export const temperatureData = [
  { time: '00:00', livingRoom: 21.5, bedroom: 20.8, kitchen: 21.0, outside: 15.2 },
  { time: '03:00', livingRoom: 20.8, bedroom: 20.2, kitchen: 20.5, outside: 14.1 },
  { time: '06:00', livingRoom: 20.5, bedroom: 20.0, kitchen: 20.2, outside: 13.8 },
  { time: '09:00', livingRoom: 21.2, bedroom: 20.5, kitchen: 21.5, outside: 17.5 },
  { time: '12:00', livingRoom: 22.8, bedroom: 21.2, kitchen: 22.5, outside: 23.2 },
  { time: '15:00', livingRoom: 23.5, bedroom: 22.0, kitchen: 23.2, outside: 25.5 },
  { time: '18:00', livingRoom: 23.0, bedroom: 22.5, kitchen: 22.8, outside: 20.8 },
  { time: '21:00', livingRoom: 22.5, bedroom: 21.8, kitchen: 22.0, outside: 17.5 },
];

// Security events data (past month)
export const securityEventsData = [
  { date: '05/01', motionAlerts: 3, doorEvents: 8, windowEvents: 1 },
  { date: '05/06', motionAlerts: 2, doorEvents: 6, windowEvents: 0 },
  { date: '05/11', motionAlerts: 4, doorEvents: 12, windowEvents: 2 },
  { date: '05/16', motionAlerts: 1, doorEvents: 5, windowEvents: 0 },
  { date: '05/21', motionAlerts: 5, doorEvents: 9, windowEvents: 3 },
  { date: '05/26', motionAlerts: 2, doorEvents: 7, windowEvents: 0 },
];

// Hourly energy usage (past day)
export const hourlyEnergyData = [
  { hour: '00:00', usage: 0.8 },
  { hour: '01:00', usage: 0.7 },
  { hour: '02:00', usage: 0.6 },
  { hour: '03:00', usage: 0.6 },
  { hour: '04:00', usage: 0.5 },
  { hour: '05:00', usage: 0.7 },
  { hour: '06:00', usage: 1.2 },
  { hour: '07:00', usage: 1.8 },
  { hour: '08:00', usage: 2.2 },
  { hour: '09:00', usage: 1.9 },
  { hour: '10:00', usage: 1.5 },
  { hour: '11:00', usage: 1.3 },
  { hour: '12:00', usage: 1.4 },
  { hour: '13:00', usage: 1.5 },
  { hour: '14:00', usage: 1.3 },
  { hour: '15:00', usage: 1.2 },
  { hour: '16:00', usage: 1.4 },
  { hour: '17:00', usage: 1.8 },
  { hour: '18:00', usage: 2.3 },
  { hour: '19:00', usage: 2.5 },
  { hour: '20:00', usage: 2.2 },
  { hour: '21:00', usage: 1.8 },
  { hour: '22:00', usage: 1.2 },
  { hour: '23:00', usage: 0.9 },
];

// Usage by room data
export const roomUsageData = [
  { name: 'Living Room', value: 35 },
  { name: 'Kitchen', value: 25 },
  { name: 'Bedroom', value: 20 },
  { name: 'Bathroom', value: 10 },
  { name: 'Office', value: 10 },
];

// Automation savings data
export const automationSavingsData = [
  { month: 'Jan', manual: 85, automated: 62 },
  { month: 'Feb', manual: 82, automated: 58 },
  { month: 'Mar', manual: 86, automated: 61 },
  { month: 'Apr', manual: 90, automated: 64 },
  { month: 'May', manual: 95, automated: 68 },
];

// Predicted vs actual usage
export const predictedUsageData = [
  { day: 'Mon', predicted: 5.5, actual: 5.2 },
  { day: 'Tue', predicted: 5.8, actual: 6.1 },
  { day: 'Wed', predicted: 5.2, actual: 4.8 },
  { day: 'Thu', predicted: 5.3, actual: 5.5 },
  { day: 'Fri', predicted: 6.8, actual: 7.2 },
  { day: 'Sat', predicted: 7.5, actual: 8.3 },
  { day: 'Sun', predicted: 6.5, actual: 6.7 },
];