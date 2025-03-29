import type { D1Database } from "@cloudflare/workers-types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: D1Database;
      NODE_ENV: "development" | "production" | "test";
    }
  }
}
