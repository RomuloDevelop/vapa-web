export type UserRole = "admin" | "member";

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
      presentations: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          img: string;
          file_path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          img: string;
          file_path: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          img?: string;
          file_path?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      donations: {
        Row: {
          id: string;
          stripe_session_id: string;
          stripe_payment_intent: string | null;
          donor_name: string;
          donor_email: string;
          amount_cents: number;
          currency: string;
          billing_address_line1: string | null;
          billing_address_line2: string | null;
          billing_city: string | null;
          billing_state: string | null;
          billing_postal_code: string | null;
          billing_country: string | null;
          receipt_email_sent: boolean;
          donation_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          stripe_session_id: string;
          stripe_payment_intent?: string | null;
          donor_name: string;
          donor_email: string;
          amount_cents: number;
          currency?: string;
          billing_address_line1?: string | null;
          billing_address_line2?: string | null;
          billing_city?: string | null;
          billing_state?: string | null;
          billing_postal_code?: string | null;
          billing_country?: string | null;
          receipt_email_sent?: boolean;
          donation_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          stripe_session_id?: string;
          stripe_payment_intent?: string | null;
          donor_name?: string;
          donor_email?: string;
          amount_cents?: number;
          currency?: string;
          billing_address_line1?: string | null;
          billing_address_line2?: string | null;
          billing_city?: string | null;
          billing_state?: string | null;
          billing_postal_code?: string | null;
          billing_country?: string | null;
          receipt_email_sent?: boolean;
          donation_date?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string | null;
          name: string;
          role: UserRole;
          membership_tier: string;
          is_active: boolean;
          invitation_token: string | null;
          invitation_expires: string | null;
          reset_token: string | null;
          reset_expires: string | null;
          email_verified: boolean;
          image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash?: string | null;
          name: string;
          role?: UserRole;
          membership_tier?: string;
          is_active?: boolean;
          invitation_token?: string | null;
          invitation_expires?: string | null;
          reset_token?: string | null;
          reset_expires?: string | null;
          email_verified?: boolean;
          image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string | null;
          name?: string;
          role?: UserRole;
          membership_tier?: string;
          is_active?: boolean;
          invitation_token?: string | null;
          invitation_expires?: string | null;
          reset_token?: string | null;
          reset_expires?: string | null;
          email_verified?: boolean;
          image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      session: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          expires_at: string;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          token: string;
          expires_at: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          token?: string;
          expires_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      account: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          provider_id: string;
          access_token: string | null;
          refresh_token: string | null;
          access_token_expires_at: string | null;
          refresh_token_expires_at: string | null;
          scope: string | null;
          id_token: string | null;
          password: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          account_id: string;
          provider_id: string;
          access_token?: string | null;
          refresh_token?: string | null;
          access_token_expires_at?: string | null;
          refresh_token_expires_at?: string | null;
          scope?: string | null;
          id_token?: string | null;
          password?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          provider_id?: string;
          access_token?: string | null;
          refresh_token?: string | null;
          access_token_expires_at?: string | null;
          refresh_token_expires_at?: string | null;
          scope?: string | null;
          id_token?: string | null;
          password?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      verification: {
        Row: {
          id: string;
          identifier: string;
          value: string;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          identifier: string;
          value: string;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          identifier?: string;
          value?: string;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
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

// Convenience type for the presentations table
export type Presentation =
  Database["public"]["Tables"]["presentations"]["Row"];
export type PresentationInsert =
  Database["public"]["Tables"]["presentations"]["Insert"];
export type PresentationUpdate =
  Database["public"]["Tables"]["presentations"]["Update"];

// Convenience type for the donations table
export type Donation = Database["public"]["Tables"]["donations"]["Row"];
export type DonationInsert =
  Database["public"]["Tables"]["donations"]["Insert"];

// Member types
export type MembershipTier = "student" | "active" | "in_transition";

export const MEMBERSHIP_TIERS: { value: MembershipTier; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "active", label: "Active" },
  { value: "in_transition", label: "In Transition" },
];

export function getMembershipTierLabel(tier: MembershipTier): string {
  return MEMBERSHIP_TIERS.find((t) => t.value === tier)?.label ?? tier;
}

export interface User {
  id: string;
  email: string;
  password_hash: string | null;
  name: string;
  role: UserRole;
  membership_tier: MembershipTier;
  is_active: boolean;
  invitation_token: string | null;
  invitation_expires: string | null;
  reset_token: string | null;
  reset_expires: string | null;
  created_at: string;
}
