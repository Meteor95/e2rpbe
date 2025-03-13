CREATE TABLE "eds_siak_coa" (
	"id" serial PRIMARY KEY NOT NULL,
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
