import { pgTable, varchar, boolean, timestamp, serial, numeric } from "drizzle-orm/pg-core";

export const eds_siak_coa = pgTable('eds_siak_coa', {
    id: serial('id').primaryKey(),
    kode_coa_group: varchar('kode_coa_group', { length: 255 }).notNull(),
    nama_coa_group: varchar('nama_coa_group', { length: 255 }).notNull(),
    default_input: varchar('default_input', { length: 255 }).notNull(),
    jenis_akun: varchar('jenis_akun', { length: 255 }).notNull(),
    saldo_awal: numeric('balance', { precision: 15, scale: 2 }).notNull(),
    saldo_awal_dc: varchar('saldo_awal_dc', { length: 255 }).notNull(),
    kas_bank: boolean('kas_bank').notNull(),
    keterangan: varchar('keterangan', { length: 255 }).notNull(),
    is_delete: boolean('is_delete').notNull(),
    kode_unik_member: varchar('kode_unik_member', { length: 255 }).notNull(),
    kode_perusahaan: numeric('kode_perusahaan', { precision: 10, scale: 0 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at'),
    deleted_at: timestamp('deleted_at')
})