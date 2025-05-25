/**
 * Database schema definitions using Drizzle ORM
 * Defines tables and relationships for the smart home system
 */
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Smart home devices table
 * Stores device information, state, and configuration
 */
export const devices = pgTable("devices", {
  id: text("id").primaryKey(),
  homeId: text("home_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  currentState: text("current_state").notNull(),
  brightness: integer("brightness"),
  createdAt: timestamp("created_at").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

/**
 * User-Home associations table
 * Links users to their homes and stores home-specific settings
 */
export const userHomes = pgTable("user_homes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  homeId: text("home_id").notNull(),
  mode: text("mode").notNull().default("home"),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Event log table
 * Records device state changes and system events
 * References devices table for device-specific events
 */
export const eventLog = pgTable("event_log", {
  id: serial("id").primaryKey(),
  homeId: text("home_id").notNull(),
  deviceId: text("device_id")
    .notNull()
    .references(() => devices.id),
  eventType: text("event_type").notNull(),
  oldState: text("old_state"),
  newState: text("new_state"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Alert log table
 * Stores system alerts and notifications
 * Can be linked to specific devices and users
 */
export const alertLog = pgTable("alert_log", {
  id: serial("id").primaryKey(),
  homeId: text("home_id").notNull(),
  userId: text("user_id").notNull(),
  deviceId: text("device_id").references(() => devices.id),
  message: text("message").notNull(),
  sentStatus: boolean("sent_status").default(false),
  dismissed: boolean("dismissed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

/** Type definitions inferred from the schema */
export type Device = typeof devices.$inferSelect;
export type NewDevice = typeof devices.$inferInsert;

export type UserHome = typeof userHomes.$inferSelect;
export type NewUserHome = typeof userHomes.$inferInsert;

export type EventLog = typeof eventLog.$inferSelect;
export type NewEventLog = typeof eventLog.$inferInsert;

export type AlertLog = typeof alertLog.$inferSelect;
export type NewAlertLog = typeof alertLog.$inferInsert;
