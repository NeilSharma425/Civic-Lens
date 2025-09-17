CREATE TABLE "analysis_results" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" varchar,
	"total_feedback" integer DEFAULT 0,
	"translated_count" integer DEFAULT 0,
	"demographic_groups" integer DEFAULT 0,
	"representation_gaps" integer DEFAULT 0,
	"sentiment_distribution" jsonb,
	"demographic_sentiment" jsonb,
	"insights" jsonb DEFAULT '[]'::jsonb,
	"recommendations" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "feedback_submissions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_text" text NOT NULL,
	"original_language" text,
	"translated_text" text,
	"sentiment_score" real,
	"sentiment_label" text,
	"inclusive_rewrite" text,
	"demographic_tags" jsonb DEFAULT '[]'::jsonb,
	"processing_status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_submission_id_feedback_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."feedback_submissions"("id") ON DELETE no action ON UPDATE no action;