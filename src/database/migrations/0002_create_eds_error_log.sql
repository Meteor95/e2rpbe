CREATE TABLE "eds_error_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"waktu_error" timestamp DEFAULT now() NOT NULL,
	"message" varchar(255) NOT NULL,
	"stack" varchar(255) NOT NULL
);
