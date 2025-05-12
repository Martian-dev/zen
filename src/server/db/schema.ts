import { type Message } from "ai";
import { type InferSelectModel } from "drizzle-orm";

import { sql } from "drizzle-orm";
import { index, varchar, json, pgTableCreator, check } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const createTable = pgTableCreator((name) => `zen_${name}`);

// const priorityEnum = pgEnum("priorityEnum", ["P1", "P2", "P3", "P4", "P5"]);

export const tasks = createTable(
  "Task",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    title: d.varchar({ length: 70 }).notNull(),
    description: d.varchar({ length: 512 }),
    priority: d.varchar({ length: 2 }).default("P5").notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    dueDate: d.timestamp({ withTimezone: true }),
    userID: d.varchar().notNull(),
    chatID: d.uuid().references(() => chats.id),
    completed: d.boolean().default(false).notNull()
  }),
  (t) => [
    index("name_idx").on(t.title),
    check("valid_priority", sql`${t.priority} IN ('P1', 'P2', 'P3', 'P4', 'P5')`),
  ],
);

export const chats = createTable("Chats", (d) => ({
  id: d.uuid().primaryKey().notNull().defaultRandom(),
  createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  messages: json().notNull(),
  userID: varchar().notNull()
}));

export type Chat = Omit<InferSelectModel<typeof chats>, "messages"> & {
  messages: Array<Message>;
};

