import { eds_users } from "@database/schema/index";
import { pgTable, varchar, timestamp, serial, date, numeric, integer, boolean, pgEnum } from "drizzle-orm/pg-core";

export const moodEnum = pgEnum('journal_type', [
    'jurnal_umum',
    'penjualan',
    'pembelian',
    'retur_penjualan',
    'retur_pembelian',
    'hutang',
    'piutang',
    'transfer_kas',
    'kas_masuk',
    'kas_keluar',
]);
export const eds_siak_entri_jurnal = pgTable('eds_siak_entri_jurnal', {
    id: serial('id').primaryKey().notNull(),
    transaction_number: varchar('transaction_number', { length: 255 }).notNull(),
    transaction_date: date('transaction_date',{ mode: "date" }).notNull(),
    total_debit: numeric('total_debit', { precision: 15, scale: 2 }).notNull(),
    total_credit: numeric('total_credit', { precision: 15, scale: 2 }).notNull(),
    global_narration: varchar('global_narration', { length: 500 }).notNull(),
    outlet: varchar('outlet', { length: 255 }).notNull(),
    kode_unik_member: varchar('kode_unik_member', { length: 255 }).notNull(),
    kode_perusahaan: varchar('kode_perusahaan', { length: 255 }).notNull(),
    entry_by: integer('entry_by').notNull().references(() => eds_users.id, {onDelete: 'cascade'}),
    edited_by: integer('edited_by').references(() => eds_users.id, {onDelete: 'cascade'}),
    journal_status: boolean('journal_status').notNull().default(false),
    verified_by: integer('verified_by').references(() => eds_users.id, {onDelete: 'cascade'}),
    journal_type: moodEnum().notNull(),
    accounting_period_id: integer('accounting_period_id').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at'),
    deleted_at: timestamp('deleted_at')
})