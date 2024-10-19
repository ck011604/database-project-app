DELIMITER //

CREATE TRIGGER inventory_update_logging
AFTER UPDATE ON inventory
FOR EACH ROW
BEGIN
    DECLARE v_action_type VARCHAR(20);
    DECLARE v_quantity_change INT;
    DECLARE v_used_amount INT UNSIGNED;
    DECLARE v_restocked_amount INT UNSIGNED;
    
    IF NEW.amount > OLD.amount THEN
        SET v_action_type = 'restock';
        SET v_quantity_change = NEW.amount - OLD.amount;
        SET v_restocked_amount = v_quantity_change;
        SET v_used_amount = 0;
    ELSE
        SET v_action_type = 'usage';
        SET v_quantity_change = OLD.amount - NEW.amount;
        SET v_used_amount = v_quantity_change;
        SET v_restocked_amount = 0;
    END IF;

    INSERT INTO inventory_summary_logs
    (ingredient_id, starting_amount, ending_amount, used_amount, restocked_amount, action_type, quantity_change)
    VALUES
    (NEW.ingredient_id, OLD.amount, NEW.amount, 
     v_used_amount, v_restocked_amount, v_action_type, v_quantity_change);
END //

DELIMITER ;

DROP TRIGGER inventory_update_logging

SHOW TRIGGERS