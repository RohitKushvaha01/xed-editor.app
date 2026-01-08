// auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { drizzle } from "drizzle-orm/d1";
import { compare } from "bcryptjs";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

//NextAuth((req) => {
// Define the shape of your environment bindings
interface CloudflareEnv {
  DB: D1Database;
  AUTH_GITHUB_ID?: string;
  AUTH_GITHUB_SECRET?: string;
  AUTH_SECRET?: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // Access the environment safely
  const env = (process.env.NEXT_RUNTIME === "edge" 
    ? globalThis 
    : process.env) as unknown as CloudflareEnv;

  const DB = env.DB; 

  if (!DB) {
    // Logging this helps debug the "prepare of undefined" error
    console.error("D1 Database binding 'DB' is missing in the current runtime.");
  }

  const db = drizzle(DB, { schema });
  return {
    adapter: DrizzleAdapter(db),
    providers: [
      GitHub,
      Credentials({
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await db.query.users.findFirst({
            where: eq(schema.users.email, credentials.email as string),
          });

          if (!user || !user.password) return null;
          const isValid = await compare(credentials.password as string, user.password);

          return isValid ? { id: user.id, email: user.email, name: user.name } : null;
        },
      }),
    ],
    session: { strategy: "jwt" },
  };
});