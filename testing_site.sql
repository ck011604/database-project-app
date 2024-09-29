-- Use this script to test the procedures and triggers in the database
-- Make sure to run the database.sql script first to create the database and tables


-- Test check_inventory_thresholds procedure
CALL check_inventory_thresholds();

-- Check the results
SELECT * FROM inventory;
SELECT * FROM inventory_logs ORDER BY log_id DESC LIMIT 5;

-- Test manually_order_ingredient procedure
CALL manually_order_ingredient(1, 1);  -- This will add 50 units to ingredient with ID 1

-- Check the results
SELECT * FROM inventory WHERE ingredient_id = 1;
SELECT * FROM inventory_logs ORDER BY log_id DESC LIMIT 5;

-- Simulate a low inventory situation
UPDATE inventory SET amount = restock_threshold WHERE ingredient_id = 1;

-- Run check_inventory_thresholds again
CALL check_inventory_thresholds();

-- Check the results
SELECT * FROM inventory WHERE ingredient_id = 1;
SELECT * FROM inventory_logs ORDER BY log_id DESC LIMIT 5;

-- Check if the event is scheduled
SHOW EVENTS;

TRUNCATE TABLE inventory_logs;
