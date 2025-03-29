// Email configuration defaults
export const EMAIL_DEFAULTS = {
  FROM_EMAIL: "onboarding@resend.dev", // Resend's test email
  TEST_EMAIL: "qitonglan@gmail.com", // Verified email for testing
  REPLY_TO: "onboarding@resend.dev",
} as const;

// Default values for smart home settings

// Default lighting values
export const DEFAULT_BRIGHTNESS = 100;
export const DEFAULT_TEMPERATURE = 4600;

// Base automation mode configurations
export const automationModes = [
  {
    id: "away",
    name: "Away Mode",
    icon: "Home",
    active: false,
    description: "Secure your home when you're away",
  },
  {
    id: "movie",
    name: "Movie Mode",
    icon: "Film",
    active: false,
    description: "Perfect lighting for movie time",
  },
  {
    id: "learning",
    name: "Learning Mode",
    icon: "BookOpen",
    active: false,
    description: "Optimal settings for study and focus",
  },
] as const;
