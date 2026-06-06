-- Adds 'pending' to the room_analyses status column.
-- 'pending' is set before the Stripe checkout; the webhook transitions it to 'paid'.
--
-- Before running, identify the column type:
--   SELECT column_name, data_type, udt_name
--   FROM information_schema.columns
--   WHERE table_name = 'room_analyses' AND column_name = 'status';
--
-- CASE 1 — ENUM type (udt_name = 'analysis_status' or similar):
--   Replace 'analysis_status' below with the actual type name if different.
ALTER TYPE analysis_status ADD VALUE IF NOT EXISTS 'pending' BEFORE 'paid';

-- CASE 2 — TEXT column with CHECK constraint (data_type = 'text'):
--   Comment out the ALTER TYPE above and run this instead:
-- ALTER TABLE room_analyses
--   DROP CONSTRAINT IF EXISTS room_analyses_status_check;
-- ALTER TABLE room_analyses
--   ADD CONSTRAINT room_analyses_status_check
--   CHECK (status IN ('pending', 'paid', 'processing', 'done', 'error'));
