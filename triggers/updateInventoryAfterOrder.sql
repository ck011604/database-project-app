-- If you are editting this trigger, drop it first then create it again with the edits.
DROP TRIGGER restaurantdb.updateInventoryAfterOrder;

DELIMITER //
CREATE TRIGGER updateInventoryAfterOrder
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
	DECLARE itemIndex INT DEFAULT 0;
    DECLARE ingredientIndex INT DEFAULT 0;
    DECLARE totalNumberItems INT;
    DECLARE totalNumberIngredients INT;
    DECLARE itemQuantity INT;
    DECLARE ingredientID INT;
    DECLARE ingredientQuantity INT;
    
	-- Loop through every menu item in the order
    SET totalNumberItems = JSON_LENGTH(NEW.items);
    WHILE itemIndex < totalNumberItems DO
		SET itemQuantity = JSON_UNQUOTE(JSON_EXTRACT(NEW.items, CONCAT('$[', itemIndex, '].quantity')));
        -- Loop through every ingredient in that menu item
        SET totalNumberIngredients = JSON_LENGTH(JSON_EXTRACT(NEW.items, CONCAT('$[', itemIndex, '].ingredients')));
        SET ingredientIndex = 0; -- Reset ingredient index
        WHILE ingredientIndex < totalNumberIngredients DO
			SET ingredientID = JSON_UNQUOTE(JSON_EXTRACT(NEW.items, CONCAT('$[', itemIndex, '].ingredients[', ingredientIndex, '].ingredient_id')));
            SET ingredientQuantity = JSON_UNQUOTE(JSON_EXTRACT(NEW.items, CONCAT('$[', itemIndex, '].ingredients[', ingredientIndex, '].quantity')));
			-- Subtract from the inventory
            UPDATE inventory SET amount = amount - (itemQuantity * ingredientQuantity) WHERE ingredient_id = ingredientID;
            SET ingredientIndex = ingredientIndex + 1;
        END WHILE;
        SET itemIndex = itemIndex + 1;
    END WHILE;
END //
DELIMITER ;

-- Used to see if it successfully was created
SHOW CREATE TRIGGER updateInventoryAfterOrder;