-- When an `accounts` is deleted, the respective `account_sessions` will be deleted as well.
-- NOTE: We have to drop the current constraint first, and re-add it with ON DELETE CASCADE.
ALTER TABLE "user"."account_sessions"
DROP CONSTRAINT IF EXISTS "fk_account_id"; 

ALTER TABLE "user"."account_sessions"
ADD CONSTRAINT "fk_account_id" FOREIGN KEY ("account_id") REFERENCES "user"."accounts" ("id") ON DELETE CASCADE;