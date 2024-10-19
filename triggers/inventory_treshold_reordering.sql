DELIMITER //

CREATE TRIGGER inventory_threshold_reordering
AFTER INSERT ON inventory_summary_logs
FOR EACH ROW
BEGIN
    DECLARE v_threshold INT UNSIGNED;
    DECLARE v_restock_amount INT UNSIGNED;
    
    -- Fetch the threshold and restock amount for this ingredient
    SELECT restock_threshold, restock_amount
    INTO v_threshold, v_restock_amount
    FROM inventory
    WHERE ingredient_id = NEW.ingredient_id;
    
    -- Check if the new amount is at or below the threshold
    IF NEW.ending_amount <= v_threshold THEN
        -- Call the restock procedure
        CALL restock_ingredient(NEW.ingredient_id, v_restock_amount);
    END IF;
END //

DELIMITER ;

DROP TRIGGER inventory_threshold_reordering

SHOW TRIGGERS