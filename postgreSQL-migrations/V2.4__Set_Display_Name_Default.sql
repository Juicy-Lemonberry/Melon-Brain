-- Trigger to default display_name to username if not provided
CREATE OR REPLACE FUNCTION set_display_name_default()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."display_name" IS NULL THEN
        NEW."display_name" := NEW."username";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_display_name_default_trigger
BEFORE INSERT ON "user"."accounts"
FOR EACH ROW
EXECUTE FUNCTION set_display_name_default();