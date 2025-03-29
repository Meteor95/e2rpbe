import { eds_siak_entri_jurnal } from "@database/schema/index";
import { pgTable, varchar, integer, timestamp, serial, numeric } from "drizzle-orm/pg-core";

export const eds_siak_entri_jurnalitem = pgTable('eds_siak_entri_jurnalitem', {
    id: serial('id').primaryKey().notNull(),
    entri_jurnal_id: integer('entri_jurnal_id').references(() => eds_siak_entri_jurnal.id, {onDelete: 'cascade'}).notNull(),
    ledger_id: integer('ledger_id').notNull(),
    journal_amount: numeric('journal_amount', { precision: 15, scale: 2 }).notNull(),
    debit_credit: varchar('debit_credit', { length: 2 }).notNull(),
    journal_narattion: varchar('journal_narattion', { length: 500 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at'),
    deleted_at: timestamp('deleted_at')
})