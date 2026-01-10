"use server";

import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { CloudflareEnv } from "@/types/cloudflare";
import { assertEnv } from "@/lib/assert-env";
import * as schema from "@/db/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name)
    return { error: "Missing email, password, or name" };

  const { env } = getCloudflareContext<CloudflareEnv>();
  assertEnv(env);
  const db = drizzle(env.DB, { schema });

  // Check if user exists using Drizzle eq helper
  const existing = await db.query.user.findFirst({
    where: eq(schema.user.email, email),
  });

  if (existing) return { error: "Email already exists" };

  const hashed = await hash(password, 10);

  await db.insert(schema.user).values({
    id: crypto.randomUUID(),
    email,
    password: hashed,
    name: name,
  });

  return { success: true };
}
