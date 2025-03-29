const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_API_URL",
] as const;

// Type for our environment variables
type EnvVar = (typeof requiredEnvVars)[number];

// Function to get environment variables with type safety
function getEnvVar(name: EnvVar): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Validate all required environment variables
function validateEnv() {
  for (const envVar of requiredEnvVars) {
    getEnvVar(envVar);
  }
}

// Run validation
validateEnv();

// API configuration
export const apiConfig = {
  url: getEnvVar("NEXT_PUBLIC_API_URL"),
} as const;

// Supabase configuration
export const supabaseConfig = {
  url: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
  anonKey: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
} as const;
