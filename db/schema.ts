import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const devices = pgTable("devices", {
  id: text("id").primaryKey(),
  homeId: text("home_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  location: text("location"),
  mode: text("mode"),
  currentState: text("current_state").notNull(),
  brightness: integer("brightness"),
  temperature: integer("temperature"),
  createdAt: timestamp("created_at").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const userHomes = pgTable("user_homes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  homeId: text("home_id").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

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

// Inferred types
export type Device = typeof devices.$inferSelect;
export type NewDevice = typeof devices.$inferInsert;

export type UserHome = typeof userHomes.$inferSelect;
export type NewUserHome = typeof userHomes.$inferInsert;

export type EventLog = typeof eventLog.$inferSelect;
export type NewEventLog = typeof eventLog.$inferInsert;

export type AlertLog = typeof alertLog.$inferSelect;
export type NewAlertLog = typeof alertLog.$inferInsert;
