-- Create a function to check username and email availability
CREATE OR REPLACE FUNCTION check_user_availability(username TEXT, email TEXT)
RETURNS TEXT AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM user.accounts WHERE username = $1) THEN
        RETURN 'Username is taken';
    ELSIF EXISTS (SELECT 1 FROM user.accounts WHERE email = $2) THEN
        RETURN 'Email is taken';
    ELSE
        RETURN 'Username and email are available';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint to username and email.
ALTER TABLE user.accounts
ADD CONSTRAINT unique_username UNIQUE (username);

ALTER TABLE user.accounts
ADD CONSTRAINT unique_email UNIQUE (email);