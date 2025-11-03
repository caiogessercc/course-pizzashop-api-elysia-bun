import { text, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";

/**
 * Definição da tabela `restaurants`.
 *
 * Observações de modelagem:
 * - `id` usa `text` gerado por `cuid2` para id único.
 * - `managerId` é um campo `text` que referencia `users.id` (user id também é text).
 * - `onDelete: "set null"` faz com que ao deletar o usuário gerente, o `manager_id` do
 *   restaurante seja definido como NULL, isso preserva o restaurante sem um gerente.
 *   Essa escolha é deliberada para evitar cascades indesejados que podem causar
 *   grandes operações automáticas no banco (importações / updates em massa).
 *
 * Boas práticas citadas no curso: evitar cascades descontrolados; escolher
 * cascades apenas onde o domínio exigir.
 */
export const restaurantsTable = pgTable("restaurants", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  managerId: text("manager_id").references(() => usersTable.id, {
    onDelete: "set null"
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Relations para Drizzle.
 *
 * - A função `relations(restaurantsTable, ({ one }) => {...})` informa ao Drizzle
 *   como realizar joins automáticos/tipados quando você usar `leftJoin`, `select` com includes, etc.
 * - Essa configuração não gera SQL nem migration; serve para tipagem e conveniência nas queries.
 *
 * Observações:
 * - Criar relations é opcional, fazer apenas quando houver operações que precisem dos dados relacionados
 *   (ex: listar restaurantes com dados do gerente). Criar todas relations sem necessidade polui o esquema.
 */
export const restaurantRelations = relations(restaurantsTable, ({ one }) => {
  return {
    manager: one(usersTable, {
      fields: [restaurantsTable.managerId],
      references: [usersTable.id],
      relationName: "restaurant_manager",
    }),
  }
});