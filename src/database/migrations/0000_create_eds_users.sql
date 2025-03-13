CREATE TABLE "eds_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"role" integer NOT NULL,
	"registration_number" varchar(255) NOT NULL,
	"status" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
