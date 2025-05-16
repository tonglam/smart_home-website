export const EMAIL_DEFAULTS = {
  FROM_EMAIL: "onboarding@resend.dev",
  TEST_EMAIL: "qitonglan@gmail.com",
  REPLY_TO: "onboarding@resend.dev",
} as const;

export const DEFAULT_BRIGHTNESS = 0;

export const automationModes = [
  {
    id: "home",
    name: "Home Mode",
    icon: "Home",
    description: "Normal home operation mode",
  },
  {
    id: "away",
    name: "Away Mode",
    icon: "Home",
    description: "Secure your home when you're away",
  },
  {
    id: "movie",
    name: "Movie Mode",
    icon: "Film",
    description: "Turn on the lights for a movie night",
  },
] as const;

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

export const CAMERA_TOPIC = "live";
