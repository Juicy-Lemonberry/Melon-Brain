-- Forgot to set fields to non-null lol
ALTER TABLE "user"."accounts" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "user"."accounts" ALTER COLUMN "display_name" SET NOT NULL;
ALTER TABLE "user"."accounts" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "user"."accounts" ALTER COLUMN "hashed_password" SET NOT NULL;
ALTER TABLE "user"."accounts" ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE "user"."account_sessions" ALTER COLUMN "account_id" SET NOT NULL;
ALTER TABLE "user"."account_sessions" ALTER COLUMN "session_token" SET NOT NULL;
ALTER TABLE "user"."account_sessions" ALTER COLUMN "device_info" SET NOT NULL;
ALTER TABLE "user"."account_sessions" ALTER COLUMN "expiry_date" SET NOT NULL;
ALTER TABLE "user"."account_sessions" ALTER COLUMN "created_at" SET NOT NULL;
ALTER TABLE "user"."account_sessions" ALTER COLUMN "last_used" SET NOT NULL;
