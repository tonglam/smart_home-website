import {
  createClient,
  RealtimeChannel,
  RealtimePostgresChangesPayload,
  SupabaseClient,
} from "@supabase/supabase-js";

// Define specific event types, excluding '*'
export type SpecificRealtimePostgresChangesListenEvent =
  | "INSERT"
  | "UPDATE"
  | "DELETE";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export const subscribeToTableChanges = <T extends { [key: string]: any }>(
  channelName: string,
  eventName:
    | SpecificRealtimePostgresChangesListenEvent
    | SpecificRealtimePostgresChangesListenEvent[]
    | "*",
  schemaName: string,
  tableName: string,
  callback: (payload: RealtimePostgresChangesPayload<T>) => void
): RealtimeChannel => {
  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*", // Use '*' to satisfy TS overloads
        schema: schemaName,
        table: tableName,
      },
      (payload: RealtimePostgresChangesPayload<T>) => {
        let shouldCallCallback = false;
        if (eventName === "*") {
          shouldCallCallback = true;
        } else if (Array.isArray(eventName)) {
          if (
            eventName.includes(
              payload.eventType as SpecificRealtimePostgresChangesListenEvent
            )
          ) {
            shouldCallCallback = true;
          }
        } else if (payload.eventType === eventName) {
          shouldCallCallback = true;
        }

        if (shouldCallCallback) {
          callback(payload);
        }
      }
    )
    .subscribe((status, err) => {
      if (err) {
        console.error(
          `[${channelName}] Realtime subscription error object:`,
          JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
        );
      }

      if (status === "CHANNEL_ERROR") {
        console.error(`[${channelName}] Realtime subscription CHANNEL_ERROR.`);
      } else if (status === "TIMED_OUT") {
        console.warn(`[${channelName}] Realtime subscription TIMED_OUT.`);
      } else if (status === "CLOSED") {
        console.warn(`[${channelName}] Realtime subscription CLOSED.`);
      }
    });

  return channel;
};
