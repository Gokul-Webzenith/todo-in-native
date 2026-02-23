CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"description" text NOT NULL,
	"status" varchar NOT NULL,
	"start_at" timestamp NOT NULL,
	"end_at" timestamp NOT NULL,
	"user_id" text NOT NULL
);