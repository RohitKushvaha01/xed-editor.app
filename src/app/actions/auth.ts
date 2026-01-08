// app/actions/auth.ts
"use server"

import { signIn } from "@/auth";
import { hash } from "bcryptjs";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { AuthError } from "next-auth";

interface CloudflareEnv {
  DB: D1Database;
  AUTH_SECRET: string;
}

export async function loginWithCredentials(formData: FormData) {
  const isLoginForm = formData.get("isLoginForm") === "true";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Accessing D1 in a Worker environment
  // Cloudflare Workers inject bindings into the global scope/process.env
const env = process.env as unknown as CloudflareEnv;
  const DB = env.DB;
    const db = drizzle(DB, { schema });
  try {
    if (!isLoginForm) {
      const hashedPassword = await hash(password, 10);
      await db.insert(schema.users).values({
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
      });
    }

    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials." };
    }
    throw error; // Rethrow to allow Next.js redirects to work
  }
}


export async function loginWithProvider(provider: "github") {
  await signIn(provider, { redirectTo: "/dashboard" });
}
