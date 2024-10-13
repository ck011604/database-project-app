DELIMITER //

CREATE TRIGGER check_inventory_thresholds
AFTER UPDATE ON inventory
FOR EACH ROW
BEGIN
    DECLARE v_restock_amount INT UNSIGNED;
    
    IF NEW.amount <= NEW.restock_threshold THEN
        SET v_restock_amount = NEW.restock_amount;
        
        UPDATE inventory 
        SET amount = amount + v_restock_amount 
        WHERE ingredient_id = NEW.ingredient_id;
        
        INSERT INTO inventory_logs (ingredient_id, action_type, quantity_change) 
        VALUES (NEW.ingredient_id, 'restock', v_restock_amount);
    END IF;
END;
//

DELIMITER ;

SHOW TRIGGERS;