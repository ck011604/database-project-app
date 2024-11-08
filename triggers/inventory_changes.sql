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

    -- Check if restock is needed (only if autoRestock is TRUE)
    IF NEW.amount <= NEW.restock_threshold AND NEW.autoRestock = TRUE THEN
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
