const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_API_URL",
] as const;

type EnvVar = (typeof requiredEnvVars)[number];

function getEnvVar(name: EnvVar): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function validateEnv() {
  for (const envVar of requiredEnvVars) {
    getEnvVar(envVar);
  }
}

validateEnv();

export const apiConfig = {
  url: getEnvVar("NEXT_PUBLIC_API_URL"),
} as const;

export const supabaseConfig = {
  url: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
  anonKey: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
} as const;
