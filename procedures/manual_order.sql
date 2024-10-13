-- Active: 1727921417886@@localhost@3306@restaurant_db
DROP PROCEDURE manually_order_ingredient;
CREATE DEFINER=`root`@`localhost` PROCEDURE `manually_order_ingredient`(
  IN p_ingredient_id INT UNSIGNED,  
  IN p_quantity INT UNSIGNED        
)
BEGIN
  
  UPDATE inventory 
  SET amount = amount + p_quantity 
  WHERE ingredient_id = p_ingredient_id;
  
  
  INSERT INTO inventory_logs (ingredient_id, action_type, quantity_change) 
  VALUES (p_ingredient_id, 'manual_order', p_quantity);
END