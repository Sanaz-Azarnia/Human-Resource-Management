import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    user: {
      id?: string;
      firstname?: string;
      lastname?: string;
      roleId?: number;
      avatarUrl?: string;       
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    token?: string;
    roleId?: number;
    firstname?: string;
    lastname?: string;
    userId?: number;
    avatarUrl?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    userId?: number;
    roleId?: number;
    firstname?: string;
    lastname?: string;
    avatarUrl?: string;
  }
}