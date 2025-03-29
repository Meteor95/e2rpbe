import { eds_users } from "@database/schema/index";
import { pgTable, varchar, integer,  timestamp, serial, text } from "drizzle-orm/pg-core";

export const eds_users_detail = pgTable('eds_users_detail', {
    id: serial('id').primaryKey().notNull(),
    user_id: integer('user_id').references(() => eds_users.id, {onDelete: 'cascade'}),
    first_name: varchar('first_name', { length: 255 }).notNull(),
    last_name: varchar('last_name', { length: 255 }).notNull(),
    address: text('address'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at'),
    deleted_at: timestamp('deleted_at')
})