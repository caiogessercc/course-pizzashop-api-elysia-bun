import { text, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";

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

export const restaurantRelations = relations(restaurantsTable, ({ one }) => {
  return {
    manager: one(usersTable, {
      fields: [restaurantsTable.managerId],
      references: [usersTable.id],
      relationName: "restaurant_manager",
    }),
  }
});