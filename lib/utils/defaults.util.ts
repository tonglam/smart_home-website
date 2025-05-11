export const EMAIL_DEFAULTS = {
  FROM_EMAIL: "onboarding@resend.dev",
  TEST_EMAIL: "qitonglan@gmail.com",
  REPLY_TO: "onboarding@resend.dev",
} as const;

export const DEFAULT_BRIGHTNESS = 100;
export const DEFAULT_TEMPERATURE = 4600;

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

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

export const CAMERA_TOPIC = "live";
