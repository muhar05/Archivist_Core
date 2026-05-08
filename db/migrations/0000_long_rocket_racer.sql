CREATE TYPE "public"."loan_status" AS ENUM('ONGOING', 'RETURNED', 'OVERDUE');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('pending', 'pending_placement', 'archived', 'loaned');--> statement-breakpoint
CREATE TYPE "public"."unit_status" AS ENUM('available', 'low_space', 'full');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'staff');--> statement-breakpoint
CREATE TABLE "loans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"borrower_id" uuid NOT NULL,
	"loan_date" timestamp DEFAULT now() NOT NULL,
	"due_date" timestamp NOT NULL,
	"return_date" timestamp,
	"status" text DEFAULT 'ONGOING' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lockers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cabinet_id" uuid NOT NULL,
	"name" text NOT NULL,
	"x" integer DEFAULT 0 NOT NULL,
	"y" integer DEFAULT 0 NOT NULL,
	"width" integer DEFAULT 20 NOT NULL,
	"height" integer DEFAULT 20 NOT NULL,
	"depth" integer DEFAULT 40 NOT NULL,
	"is_assignable" boolean DEFAULT true NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" text,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'staff' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_employee_id_unique" UNIQUE("employee_id"),
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "report_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"sub_category" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"action" text NOT NULL,
	"from_user_id" uuid,
	"to_user_id" uuid,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unit_id" uuid,
	"locker_id" uuid,
	"category_id" uuid,
	"report_number" text NOT NULL,
	"report_date" timestamp DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"client" text,
	"description" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_by" uuid NOT NULL,
	"current_holder_id" uuid,
	"placement_confirmed_at" timestamp,
	"placement_confirmed_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"floor_number" integer DEFAULT 1 NOT NULL,
	"grid_width" integer DEFAULT 50 NOT NULL,
	"grid_height" integer DEFAULT 50 NOT NULL,
	"width_cm" integer DEFAULT 1500 NOT NULL,
	"height_cm" integer DEFAULT 1000 NOT NULL,
	"ceiling_height_cm" integer DEFAULT 300 NOT NULL,
	"description" text,
	"is_maintenance" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sop_requirements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"x" integer DEFAULT 0 NOT NULL,
	"y" integer DEFAULT 0 NOT NULL,
	"z" integer DEFAULT 0 NOT NULL,
	"width" integer DEFAULT 100 NOT NULL,
	"height" integer DEFAULT 100 NOT NULL,
	"depth" integer DEFAULT 40 NOT NULL,
	"rotation" integer DEFAULT 0 NOT NULL,
	"unit_type" text DEFAULT 'CABINET' NOT NULL,
	"is_assignable" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"internal_width" integer,
	"internal_height" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_borrower_id_profiles_id_fk" FOREIGN KEY ("borrower_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lockers" ADD CONSTRAINT "lockers_cabinet_id_storage_units_id_fk" FOREIGN KEY ("cabinet_id") REFERENCES "public"."storage_units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_logs" ADD CONSTRAINT "report_logs_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_logs" ADD CONSTRAINT "report_logs_from_user_id_profiles_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_logs" ADD CONSTRAINT "report_logs_to_user_id_profiles_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_unit_id_storage_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."storage_units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_locker_id_lockers_id_fk" FOREIGN KEY ("locker_id") REFERENCES "public"."lockers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_category_id_report_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."report_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_current_holder_id_profiles_id_fk" FOREIGN KEY ("current_holder_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_placement_confirmed_by_profiles_id_fk" FOREIGN KEY ("placement_confirmed_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_units" ADD CONSTRAINT "storage_units_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_units" ADD CONSTRAINT "storage_units_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."storage_units"("id") ON DELETE cascade ON UPDATE no action;