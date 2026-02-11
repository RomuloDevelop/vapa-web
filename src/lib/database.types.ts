export type EventType = "webinar" | "special_event";

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "webinar", label: "Webinar" },
  { value: "special_event", label: "Special Event" },
];

export function getEventTypeLabel(type: EventType): string {
  return EVENT_TYPES.find((t) => t.value === type)?.label ?? type;
}

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          name: string;
          img: string;
          date: string;
          type: EventType;
          time: string;
          presenters: string[];
          links: string[];
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          img: string;
          date: string;
          type: EventType;
          time: string;
          presenters: string[];
          links: string[];
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          img?: string;
          date?: string;
          type?: EventType;
          time?: string;
          presenters?: string[];
          links?: string[];
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Convenience type for the events table
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
