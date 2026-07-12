import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: "GRATUIT" | "PREMIUM";
      slugBoutique: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    plan: "GRATUIT" | "PREMIUM";
    slugBoutique: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan: "GRATUIT" | "PREMIUM";
    slugBoutique: string;
  }
}
