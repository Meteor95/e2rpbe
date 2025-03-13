import { pgTable, varchar, boolean, timestamp, serial, numeric } from "drizzle-orm/pg-core";

export const eds_error_log = pgTable('eds_error_log', {
    id: serial('id').primaryKey(),
    waktu_error: timestamp('waktu_error').notNull().defaultNow(),
    message: varchar('message', { length: 255 }).notNull(),
    stack: varchar('stack', { length: 255 }).notNull(),
})