CREATE TABLE IF NOT EXISTS "user"."account_sessions" (
    "id" SERIAL PRIMARY KEY,
    "account_id" INT,
    "session_token" VARCHAR,
    "device_info" TEXT,
    "expiry_date" TIMESTAMP,
    "created_at" TIMESTAMP,
    "last_used" TIMESTAMP,
    CONSTRAINT "fk_account_id" FOREIGN KEY ("account_id") REFERENCES "user"."accounts" ("id")
);