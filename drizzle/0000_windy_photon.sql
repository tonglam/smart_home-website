CREATE TABLE "alert_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"home_id" text NOT NULL,
	"user_id" text NOT NULL,
	"device_id" text,
	"message" text NOT NULL,
	"sent_status" boolean DEFAULT false,
	"dismissed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" text PRIMARY KEY NOT NULL,
	"home_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"location" text,
	"mode" text,
	"current_state" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"home_id" text NOT NULL,
	"device_id" text NOT NULL,
	"event_type" text NOT NULL,
	"old_state" text,
	"new_state" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_homes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"home_id" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "alert_log" ADD CONSTRAINT "alert_log_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_log" ADD CONSTRAINT "event_log_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;