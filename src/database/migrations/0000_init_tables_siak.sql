CREATE TYPE "public"."journal_type" AS ENUM('jurnal_umum', 'penjualan', 'pembelian', 'retur_penjualan', 'retur_pembelian', 'hutang', 'piutang', 'transfer_kas', 'kas_masuk', 'kas_keluar');--> statement-breakpoint
CREATE TABLE "eds_error_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"waktu_error" timestamp DEFAULT now() NOT NULL,
	"message" varchar(255) NOT NULL,
	"stack" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eds_siak_coa" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer NOT NULL,
	"kode_coa_group" varchar(255) NOT NULL,
	"nama_coa_group" varchar(255) NOT NULL,
	"default_input" varchar(255) NOT NULL,
	"jenis_akun" varchar(255) NOT NULL,
	"balance" numeric(15, 2) NOT NULL,
	"saldo_awal_dc" varchar(255) NOT NULL,
	"kas_bank" boolean NOT NULL,
	"keterangan" varchar(255) NOT NULL,
	"is_delete" boolean NOT NULL,
	"kode_unik_member" varchar(255) NOT NULL,
	"kode_perusahaan" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "eds_siak_entri_jurnal" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_number" varchar(255) NOT NULL,
	"transaction_date" date NOT NULL,
	"total_debit" numeric(15, 2) NOT NULL,
	"total_credit" numeric(15, 2) NOT NULL,
	"global_narration" varchar(500) NOT NULL,
	"outlet" varchar(255) NOT NULL,
	"kode_unik_member" varchar(255) NOT NULL,
	"kode_perusahaan" varchar(255) NOT NULL,
	"entry_by" integer NOT NULL,
	"edited_by" integer,
	"journal_status" boolean DEFAULT false NOT NULL,
	"verified_by" integer,
	"journal_type" "journal_type" NOT NULL,
	"accounting_period_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "eds_siak_entri_jurnalitem" (
	"id" serial PRIMARY KEY NOT NULL,
	"entri_jurnal_id" integer NOT NULL,
	"ledger_id" integer NOT NULL,
	"journal_amount" numeric(15, 2) NOT NULL,
	"debit_credit" varchar(2) NOT NULL,
	"journal_narattion" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "eds_siak_period" (
	"id" serial PRIMARY KEY NOT NULL,
	"kode_unik_member" varchar(255) NOT NULL,
	"kode_perusahaan" varchar(255) NOT NULL,
	"start_period" date NOT NULL,
	"end_period" date NOT NULL,
	"status" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "eds_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"role" integer NOT NULL,
	"registration_number" varchar(255) NOT NULL,
	"status" boolean NOT NULL,
	"max_allowed_login" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "eds_users_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "eds_users_login" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"deviced_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "eds_siak_entri_jurnal" ADD CONSTRAINT "eds_siak_entri_jurnal_entry_by_eds_users_id_fk" FOREIGN KEY ("entry_by") REFERENCES "public"."eds_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eds_siak_entri_jurnal" ADD CONSTRAINT "eds_siak_entri_jurnal_edited_by_eds_users_id_fk" FOREIGN KEY ("edited_by") REFERENCES "public"."eds_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eds_siak_entri_jurnal" ADD CONSTRAINT "eds_siak_entri_jurnal_verified_by_eds_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."eds_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eds_siak_entri_jurnalitem" ADD CONSTRAINT "eds_siak_entri_jurnalitem_entri_jurnal_id_eds_siak_entri_jurnal_id_fk" FOREIGN KEY ("entri_jurnal_id") REFERENCES "public"."eds_siak_entri_jurnal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eds_users_detail" ADD CONSTRAINT "eds_users_detail_user_id_eds_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."eds_users"("id") ON DELETE cascade ON UPDATE no action;