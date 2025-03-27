CREATE TABLE "eds_error_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"waktu_error" timestamp DEFAULT now() NOT NULL,
	"message" varchar(255) NOT NULL,
	"stack" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eds_siak_coa" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" numeric(10, 0) NOT NULL,
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
	"kode_perusahaan" numeric(10, 0) NOT NULL,
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
