/**
 * Database connection configuration using Drizzle ORM with PostgreSQL
 * Sets up the database client and ORM instance for use across the application
 */
import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

/** Database connection string from environment variables */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

/** Raw PostgreSQL client instance */
export const client = postgres(connectionString, { prepare: false });

/** Drizzle ORM instance for type-safe database operations */
export const db = drizzle(client);
