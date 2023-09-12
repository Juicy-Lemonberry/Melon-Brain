ALTER TABLE "user"."accounts" 
    ALTER COLUMN "created_at" SET DEFAULT timezone('GMT+8', CURRENT_TIMESTAMP);

ALTER TABLE "user"."account_sessions" 
    ALTER COLUMN "created_at" SET DEFAULT timezone('GMT+8', CURRENT_TIMESTAMP);
ALTER TABLE "user"."account_sessions" 
    ALTER COLUMN "last_used" SET DEFAULT timezone('GMT+8', CURRENT_TIMESTAMP);