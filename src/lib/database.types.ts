export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          name: string;
          img: string;
          date: string;
          type: string;
          time: string;
          presenters: string[];
          links: string[];
          is_special: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          img: string;
          date: string;
          type: string;
          time: string;
          presenters: string[];
          links: string[];
          is_special?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          img?: string;
          date?: string;
          type?: string;
          time?: string;
          presenters?: string[];
          links?: string[];
          is_special?: boolean;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience type for the events table
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
