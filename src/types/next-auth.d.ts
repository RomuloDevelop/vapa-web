import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "admin" | "member";
    membershipTier?: string;
  }

  interface Session {
    user: {
      id: string;
      role: "admin" | "member";
      membershipTier?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "member";
    membershipTier?: string;
    userId?: string;
  }
}
