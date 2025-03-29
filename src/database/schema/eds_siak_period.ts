import { pgTable, varchar, date, timestamp, serial } from "drizzle-orm/pg-core";

export const eds_siak_period = pgTable('eds_siak_period', {
    id: serial('id').primaryKey().notNull(),
    kode_unik_member: varchar('kode_unik_member', { length: 255 }).notNull(),
    kode_perusahaan: varchar('kode_perusahaan', { length: 255 }).notNull(),
    start_period: date('start_period',{ mode: "date" }).notNull(),
    end_period: date('end_period',{ mode: "date" }).notNull(),
    status: varchar('status', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at'),
    deleted_at: timestamp('deleted_at')
})