-- Drop campaign table and any dependent objects
DROP TABLE IF EXISTS campaign CASCADE;

-- When Spring starts again with ddl-auto=update, it will recreate the table with TEXT columns 