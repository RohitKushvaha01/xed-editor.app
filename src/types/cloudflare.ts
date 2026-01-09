export interface CloudflareEnv extends Record<string, unknown> {
  DB: D1Database;
  AUTH_GITHUB_ID?: string;
  AUTH_GITHUB_SECRET?: string;
  AUTH_SECRET?: string;
}
