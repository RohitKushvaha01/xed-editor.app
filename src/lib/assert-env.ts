// src/lib/assert-env.ts
import type { CloudflareEnv } from "@/types/cloudflare";

export function assertEnv(env: unknown): asserts env is CloudflareEnv {
  if (typeof env !== "object" || env === null || !("DB" in env)) {
    throw new Error("D1 Database binding 'DB' is missing");
  }
}
