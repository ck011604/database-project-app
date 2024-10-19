DELIMITER //

CREATE PROCEDURE restock_ingredient(IN p_ingredient_id INT UNSIGNED, IN p_restock_amount INT UNSIGNED)
BEGIN
    -- Update the inventory
    UPDATE inventory
    SET amount = amount + p_restock_amount
    WHERE ingredient_id = p_ingredient_id;
    
    -- The log entry for this restock will be created by the inventory_update_logging trigger
END //

DELIMITER ;

DROP PROCEDURE restock_ingredient

-- Check the current state of tomato sauce
SELECT * FROM inventory WHERE name = 'tomato sauce';

-- Set the amount of tomato sauce to 9 (below the restock threshold of 10)
UPDATE inventory
SET amount = 111 
WHERE name = 'tomato sauce';

-- Check the state after the update (should show restocked amount)
SELECT * FROM inventory WHERE name = 'tomato sauce';

-- Check the logs to see the update and restock actions
SELECT * FROM inventory_summary_logs
WHERE ingredient_id = (SELECT ingredient_id FROM inventory WHERE name = 'tomato sauce')
ORDER BY timestamp DESC
LIMIT 2;

