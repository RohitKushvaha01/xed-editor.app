import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password"), // Only for Credentials
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});
