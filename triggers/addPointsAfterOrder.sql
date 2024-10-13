DROP TRIGGER restaurantdb.addPointsAfterOrder;

DELIMITER //
CREATE TRIGGER addPointsAfterOrder
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.customer_id IS NOT NULL AND NEW.pointsEarned IS NOT NULL THEN
	    UPDATE users SET points = points + NEW.pointsEarned WHERE user_id = NEW.customer_id;
    END IF;
END //
DELIMITER ;

-- Used to see if it successfully was created
SHOW CREATE TRIGGER addPointsAfterOrder;