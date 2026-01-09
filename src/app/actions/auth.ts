// app/actions/auth.ts
"use server";

import { signIn } from "@/auth";
import { hash } from "bcryptjs";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { AuthError } from "next-auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { CloudflareEnv } from "@/types/cloudflare";
import { assertEnv } from "@/lib/assert-env";
import { isRedirectError } from "next/dist/client/components/redirect-error";


export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { 
      email, 
      password, 
      redirectTo: "/dashboard" 
    });
  } catch (error) {
    // 1. If it's a redirect, we MUST rethrow it so Next.js can handle the navigation
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    
    // 2. Alternatively, check using the built-in helper
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    
    console.error("Actual Login Error:", error);
    return { error: "Something went wrong." };
  }
}
export async function loginWithProvider(provider: "github") {
  await signIn(provider, { redirectTo: "/dashboard" });
}
