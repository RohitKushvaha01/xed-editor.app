// auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { drizzle } from "drizzle-orm/d1";
import { compare } from "bcryptjs";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { CloudflareEnv } from "@/types/cloudflare";
import { assertEnv } from "@/lib/assert-env";

interface CredentialsInput {
  email: string;
  password: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const { env } = getCloudflareContext<CloudflareEnv>();
  assertEnv(env);
  const db = drizzle(env.DB, { schema });

  return {
    trustHost: true,
    adapter: DrizzleAdapter(db), // only handles GitHub
    providers: [
      GitHub({
        clientId: env.GITHUB_CLIENT_ID as string,
        clientSecret: env.GITHUB_CLIENT_SECRET as string,
      }),

      Credentials({
        async authorize(credentials) {
          // Return null if credentials missing
          if (!credentials) return null;

          // Type-safe runtime check
          const email = credentials.email;
          const password = credentials.password;

          if (typeof email !== "string" || typeof password !== "string")
            return null;

          const user = await db.query.user.findFirst({
            where: eq(schema.user.email, email),
          });

          if (!user || !user.password) return null;

          const isValid = await compare(password, user.password);
          if (!isValid) return null;

          return { id: user.id, email: user.email, name: user.name };
        },
      }),
    ],
    events: {
      async linkAccount({ user }) {
        if (user.id) {
          await db
            .update(schema.user)
            .set({ emailVerified: true })
            .where(eq(schema.user.id, user.id));
        }
      },
    },
    session: {
      strategy: "jwt",
      maxAge: 1 * 24 * 60 * 60, // 1 day instead of 30 days
      updateAge: 24 * 60 * 60,
    },
  };
});
