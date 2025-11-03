import { text, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { usersTable } from "./users";

/**
 * Tabela: auth_links
 *
 * Armazena tokens temporários para autenticação passwordless.
 * 
 */
export const authLinksTable = pgTable("auth_links", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  code: text("code").notNull().unique(),
  userId: text("user_id")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
