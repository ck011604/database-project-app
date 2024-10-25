DELIMITER ;;

DROP TRIGGER IF EXISTS inventory_changes;;

CREATE TRIGGER inventory_changes
BEFORE UPDATE ON inventory 
FOR EACH ROW 
BEGIN
    DECLARE change_amount INT;
    
    -- Calculate the change amount (can be negative)
    IF NEW.amount < OLD.amount THEN
        SET change_amount = -(OLD.amount - NEW.amount);  -- Negative for usage
    ELSE
        SET change_amount = NEW.amount - OLD.amount;     -- Positive for restock
    END IF;

    -- Log the inventory change
    INSERT INTO inventory_logs (
        ingredient_id,
        action_type,
        quantity_change,
        log_date,
        log_time
    )
    VALUES (
        NEW.ingredient_id,
        CASE 
            WHEN NEW.amount < OLD.amount THEN 
                CASE 
                    WHEN @action_type = 'discarded' THEN 'discarded'
                    ELSE 'used'
                END
            ELSE 'restock'
        END,
        change_amount,
        CURRENT_DATE,
        CURRENT_TIME
    );

    -- Check if restock is needed
    IF NEW.amount <= NEW.restock_threshold THEN
        SET NEW.amount = NEW.amount + NEW.restock_amount;
        
        -- Log the restock
        INSERT INTO inventory_logs (
            ingredient_id,
            action_type,
            quantity_change,
            log_date,
            log_time
        )
        VALUES (
            NEW.ingredient_id,
            'restock',
            NEW.restock_amount,
            CURRENT_DATE,
            CURRENT_TIME
        );
    END IF;
END;;

DELIMITER ;
SHOW TRIGGERS


-- Test reducing inventory
UPDATE inventory SET amount = amount - 10 WHERE ingredient_id = 1;

-- Check the logs (should show both the reduction and restock if threshold was hit)
SELECT * FROM inventory_logs WHERE ingredient_id = 1 ORDER BY log_id DESC;

-- Check final inventory amount
SELECT * FROM inventory WHERE ingredient_id = 1;
