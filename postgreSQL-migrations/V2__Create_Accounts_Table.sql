CREATE TABLE IF NOT EXISTS "user"."accounts" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(64),
    "display_name" VARCHAR(64),
    "email" VARCHAR,
    "hashed_password" BYTEA,
    "created_at" TIMESTAMP
);