import { pgTable, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const eds_users = pgTable('eds_users', {
    id: varchar('id', { length: 255 }).primaryKey(),
    uuid: varchar('uuid', { length: 255 }).notNull(),
    username: varchar('username', { length: 100 }).notNull(),
    password: varchar('password', { length: 100 }).notNull(),
    role: integer('role').notNull(),
    registration_number: varchar('registration_number', { length: 255 }).notNull(),
    status: boolean('status').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at'),
    deleted_at: timestamp('deleted_at')
})