import { pgTable, varchar, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { number } from "zod";

export const eds_users = pgTable('eds_users', {
    id: serial('id').primaryKey().notNull(),
    entri_jurnal_id: varchar('uuid', { length: 255 }).notNull(),
    ledger_id: varchar('email', { length: 255 }).notNull(),
    number
    
    
    
    
    
    
    
    
    
    
    
    
    
    : varchar('phone', { length: 20 }).notNull(),
    username: varchar('username', { length: 100 }).notNull(),
    password: varchar('password', { length: 100 }).notNull(),
    role: integer('role').notNull(),
    registration_number: varchar('registration_number', { length: 255 }).notNull(),
    status: boolean('status').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at'),
    deleted_at: timestamp('deleted_at')
})