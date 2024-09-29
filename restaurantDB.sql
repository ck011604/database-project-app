-- MySQL dump 10.13  Distrib 9.0.1, for Win64 (x86_64)
--
-- Host: localhost    Database: restaurantdb
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employee_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` varchar(50) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='employee accounts';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Amy','Lee','amy@example.com','Manager',1,'123'),(2,'Bob','Ross','bob@example.com','Waiter',0,'123'),(3,'Sam','Do','sam@example.com','Chef',0,'123'),(4,'Taylor','Swift','taylor@example.com','Manager',1,'123'),(5,'Dan','Pie','dan@example.com','Chef',0,'123'),(6,'Daz','Pir','daz@example.com','Chef',0,'123'),(7,'Daz','Pir','daz@example.com','Chef',0,'123');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `ingredient_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `amount` int unsigned NOT NULL,
  `restock_threshold` int unsigned NOT NULL,
  `restock_amount` int unsigned NOT NULL,
  PRIMARY KEY (`ingredient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='inventory of ingredients';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,'mozzarella',100,20,100),(2,'tomato sauce',100,10,100),(3,'dough',100,10,50),(4,'pepperoni',200,50,100),(5,'cheddar cheese',100,20,100),(6,'beef patty',100,20,50),(7,'lettuce',100,20,50),(8,'tomato',100,20,50),(9,'pasta',100,20,50),(10,'chicken',100,20,70),(11,'garlic',100,20,50),(12,'fish fillets',50,10,30),(13,'tortillas',100,20,50),(14,'cabbage',100,20,50),(15,'lime',100,40,50),(16,'sour cream',50,20,50),(17,'milk',100,20,50),(18,'butter',100,30,100),(19,'flour',100,40,200),(20,'hamburger bun',100,20,75),(21,'hot dog sausage',100,20,50),(22,'hot dog bun',100,30,100),(23,'mustard',100,40,100),(24,'ketchup',100,30,100),(25,'relish',50,20,45),(26,'potatoes',100,30,100),(27,'carrots',100,20,60),(28,'mayonnaise',60,10,40),(29,'bread',100,10,40),(30,'corn',15,10,50),(31,'salt',100,40,100),(32,'Sprite',100,20,100),(33,'Coca-Cola',100,20,100),(34,'Pepsi',100,20,100),(35,'Dr. Pepper',100,20,100),(36,'Fanta Orange',0,20,100),(37,'Diet Coke',100,20,100),(38,'Black Tea',100,20,70),(39,'Sugar',100,20,100);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;

--
-- Table structure for table `inventory_logs`
--

DROP TABLE IF EXISTS `inventory_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

-- Table to log all inventory changes (restocks, manual orders, usage)
CREATE TABLE `inventory_logs` (
  `log_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `ingredient_id` int unsigned NOT NULL,                              -- References the ingredient in inventory
  `action_type` enum('restock', 'manual_order', 'usage') NOT NULL,    -- Type of inventory change
  `quantity_change` int NOT NULL,                                     -- Amount of change (positive or negative)
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,           -- When the change occurred
  PRIMARY KEY (`log_id`),
  KEY `fk_inventory_logs_ingredient_id` (`ingredient_id`),
  CONSTRAINT `fk_inventory_logs_ingredient_id` FOREIGN KEY (`ingredient_id`) REFERENCES `inventory` (`ingredient_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='logs for inventory changes';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_logs`
--

/*!40000 ALTER TABLE `inventory_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_logs` ENABLE KEYS */;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `recipe_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ingredients` json NOT NULL COMMENT 'JSON format list of ingredientID and Quantity',
  `price` decimal(10,2) unsigned NOT NULL,
  `image` varchar(255) NOT NULL COMMENT 'Path to the image',
  `type` varchar(50) NOT NULL COMMENT 'menu type (Ex: main, side, drink)',
  PRIMARY KEY (`recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='resturant menu items';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'Cheese Pizza','[{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}]',15.99,'cheese_pizza.jpg','main'),(2,'Pepperoni Pizza','[{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}, {\"quantity\": 20, \"ingredient_id\": 4}]',15.99,'pepperoni_pizza.jpg','main'),(3,'Cheese Burger','[{\"quantity\": 2, \"ingredient_id\": 5}, {\"quantity\": 1, \"ingredient_id\": 6}, {\"quantity\": 2, \"ingredient_id\": 7}, {\"quantity\": 2, \"ingredient_id\": 8}, {\"quantity\": 1, \"ingredient_id\": 20}]',7.99,'cheese_burger.jpg','main'),(4,'Chicken Alfredo','[{\"quantity\": 10, \"ingredient_id\": 9}, {\"quantity\": 2, \"ingredient_id\": 10}, {\"quantity\": 3, \"ingredient_id\": 11}]',10.99,'chicken_alfredo.jpg','main'),(5,'Fish Tacos','[{\"quantity\": 3, \"ingredient_id\": 12}, {\"quantity\": 5, \"ingredient_id\": 13}, {\"quantity\": 3, \"ingredient_id\": 14}, {\"quantity\": 3, \"ingredient_id\": 15}, {\"quantity\": 4, \"ingredient_id\": 16}]',8.99,'fish_tacos.jpg','main'),(6,'Mac and Cheese','[{\"quantity\": 7, \"ingredient_id\": 9}, {\"quantity\": 10, \"ingredient_id\": 5}, {\"quantity\": 3, \"ingredient_id\": 17}, {\"quantity\": 5, \"ingredient_id\": 18}, {\"quantity\": 3, \"ingredient_id\": 19}]',4.99,'mac_and_cheese.jpg','side'),(7,'Hot Dogs','[{\"quantity\": 3, \"ingredient_id\": 21}, {\"quantity\": 3, \"ingredient_id\": 22}, {\"quantity\": 3, \"ingredient_id\": 23}, {\"quantity\": 3, \"ingredient_id\": 24}, {\"quantity\": 5, \"ingredient_id\": 25}]',8.99,'hot_dogs.jpg','main'),(8,'Mashed Potatoes','[{\"quantity\": 1, \"ingredient_id\": 26}, {\"quantity\": 3, \"ingredient_id\": 18}, {\"quantity\": 1, \"ingredient_id\": 17}, {\"quantity\": 5, \"ingredient_id\": 31}]',4.99,'mashed_potatoes.jpg','side'),(9,'Coleslaw','[{\"quantity\": 1, \"ingredient_id\": 14}, {\"quantity\": 1, \"ingredient_id\": 27}, {\"quantity\": 2, \"ingredient_id\": 28}]',3.99,'coleslaw.jpg','side'),(10,'Garlic Bread','[{\"quantity\": 3, \"ingredient_id\": 29}, {\"quantity\": 5, \"ingredient_id\": 18}, {\"quantity\": 3, \"ingredient_id\": 11}]',4.99,'garlic_bread.jpg','side'),(11,'Corn','[{\"quantity\": 2, \"ingredient_id\": 30}, {\"quantity\": 3, \"ingredient_id\": 31}, {\"quantity\": 5, \"ingredient_id\": 18}]',3.99,'corn.jpg','side'),(12,'Sprite','[{\"quantity\": 1, \"ingredient_id\": 32}]',1.99,'sprite.png','drink'),(13,'Coca-Cola','[{\"quantity\": 1, \"ingredient_id\": 33}]',1.99,'coca-cola.png','drink'),(14,'Pepsi','[{\"quantity\": 1, \"ingredient_id\": 34}]',1.99,'pepsi.png','drink'),(15,'Dr. Pepper','[{\"quantity\": 1, \"ingredient_id\": 35}]',1.99,'dr-pepper.png','drink'),(16,'Fanta Orange','[{\"quantity\": 1, \"ingredient_id\": 36}]',1.99,'fanta.png','drink'),(17,'Diet Coke','[{\"quantity\": 1, \"ingredient_id\": 37}]',1.99,'diet_coke.png','drink'),(18,'Sweet Tea','[{\"quantity\": 1, \"ingredient_id\": 38}, {\"quantity\": 5, \"ingredient_id\": 39}]',1.99,'sweet_tea.jpg','drink');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `items` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'JSON format list of Recipes and Quantity',
  `waiter_id` int unsigned NOT NULL,
  `table_id` int unsigned NOT NULL,
  `customer_id` int unsigned DEFAULT NULL,
  `subtotal` decimal(10,2) unsigned NOT NULL,
  `tip_percent` int unsigned NOT NULL,
  `tip_amount` decimal(10,2) unsigned NOT NULL,
  `total` decimal(10,2) unsigned NOT NULL,
  `received_amount` decimal(10,2) unsigned NOT NULL,
  `change_amount` decimal(10,2) unsigned NOT NULL,
  `tax_amount` decimal(10,2) unsigned NOT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'In-Queue',
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_waiter_id` (`waiter_id`),
  KEY `fk_orders_table_id` (`table_id`),
  KEY `fk_orders_customer_id` (`customer_id`),
  CONSTRAINT `fk_orders_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_table_id` FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`table_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_waiter_id` FOREIGN KEY (`waiter_id`) REFERENCES `employees` (`employee_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='receipt and payment info';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'[{\"recipe_id\":1,\"name\":\"Cheese Pizza\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":2},{\"quantity\":5,\"ingredient_id\":1},{\"quantity\":1,\"ingredient_id\":3}],\"price\":\"15.99\",\"image\":\"cheese_pizza.jpg\",\"type\":\"main\",\"quantity\":20}]',1,1,NULL,319.80,15,47.97,394.15,400.00,5.85,26.38,'In-Queue'),(2,'[{\"recipe_id\":14,\"name\":\"Pepsi\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":34}],\"price\":\"1.99\",\"image\":\"pepsi.png\",\"type\":\"drink\",\"quantity\":10},{\"recipe_id\":3,\"name\":\"Cheese Burger\",\"ingredients\":[{\"quantity\":2,\"ingredient_id\":5},{\"quantity\":1,\"ingredient_id\":6},{\"quantity\":2,\"ingredient_id\":7},{\"quantity\":2,\"ingredient_id\":8},{\"quantity\":1,\"ingredient_id\":20}],\"price\":\"7.99\",\"image\":\"cheese_burger.jpg\",\"type\":\"main\",\"quantity\":5}]',1,1,NULL,59.85,15,8.98,73.77,74.50,0.73,4.94,'In-Queue');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

--
-- Table structure for table `request_schedule`
--

DROP TABLE IF EXISTS `request_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `request_schedule` (
  `request_id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `employee_id` int unsigned NOT NULL,
  `request_type` varchar(50) NOT NULL,
  `request_start_date` date NOT NULL,
  `request_end_date` date NOT NULL,
  `status` varchar(50) NOT NULL,
  `submitted_at` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`request_id`),
  KEY `fk_request_schedule_employee_id` (`employee_id`),
  CONSTRAINT `fk_request_schedule_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='request schedule change';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request_schedule`
--

/*!40000 ALTER TABLE `request_schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `request_schedule` ENABLE KEYS */;

--
-- Table structure for table `restaurant_tables`
--

DROP TABLE IF EXISTS `restaurant_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant_tables` (
  `table_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `waiter_id` int unsigned DEFAULT NULL,
  `order_id` int unsigned DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Free',
  PRIMARY KEY (`table_id`),
  KEY `fk_restaurant_tables_waiter_id` (`waiter_id`),
  KEY `fk_restaurant_tables_order_id` (`order_id`),
  CONSTRAINT `fk_restaurant_tables_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_restaurant_tables_waiter_id` FOREIGN KEY (`waiter_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='every table in the restuarant';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_tables`
--

/*!40000 ALTER TABLE `restaurant_tables` DISABLE KEYS */;
INSERT INTO `restaurant_tables` VALUES (1,NULL,NULL,'Free');
/*!40000 ALTER TABLE `restaurant_tables` ENABLE KEYS */;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `schedule_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `employee_id` int unsigned NOT NULL,
  `shift_id` int unsigned NOT NULL,
  `schedule_date` date NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `fk_schedule_employee_id` (`employee_id`),
  KEY `fk_schedule_shift_id` (`shift_id`),
  CONSTRAINT `fk_schedule_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_schedule_shift_id` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`shift_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;

--
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shifts` (
  `shift_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `shift_date` date NOT NULL,
  `shift_start_time` time NOT NULL,
  `shift_end_time` time NOT NULL,
  `shift_name` varchar(50) NOT NULL,
  `is_filled` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`shift_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shifts`
--

/*!40000 ALTER TABLE `shifts` DISABLE KEYS */;
/*!40000 ALTER TABLE `shifts` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `points` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='customer accounts';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Mike','Ross','mikeross@gmail.com','mike123','user',1,0),(2,'Tony','Smith','ts@example.com','ts123','user',1,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

--
-- Dumping routines for database 'restaurantdb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

DELIMITER //

-- Procedure to check and restock ingredients below threshold
CREATE PROCEDURE check_inventory_thresholds()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE v_ingredient_id INT UNSIGNED;
  DECLARE v_name VARCHAR(50);
  DECLARE v_amount INT UNSIGNED;
  DECLARE v_restock_threshold INT UNSIGNED;
  DECLARE v_restock_amount INT UNSIGNED;
  
  -- Cursor to select ingredients below threshold
  DECLARE cur CURSOR FOR 
    SELECT ingredient_id, name, amount, restock_threshold, restock_amount 
    FROM inventory 
    WHERE amount <= restock_threshold;
  
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
  OPEN cur;
  
  read_loop: LOOP
    FETCH cur INTO v_ingredient_id, v_name, v_amount, v_restock_threshold, v_restock_amount;
    IF done THEN
      LEAVE read_loop;
    END IF;
    
    -- Restock the ingredient
    UPDATE inventory 
    SET amount = amount + v_restock_amount 
    WHERE ingredient_id = v_ingredient_id;
    
    -- Log the restock action
    INSERT INTO inventory_logs (ingredient_id, action_type, quantity_change) 
    VALUES (v_ingredient_id, 'restock', v_restock_amount);
    
  END LOOP;
  
  CLOSE cur;
END //

-- Procedure for manually ordering ingredients
CREATE PROCEDURE manually_order_ingredient(IN p_ingredient_id INT UNSIGNED, IN p_quantity INT UNSIGNED)
BEGIN
  -- Update inventory with ordered amount
  UPDATE inventory 
  SET amount = amount + p_quantity 
  WHERE ingredient_id = p_ingredient_id;
  
  -- Log the manual order
  INSERT INTO inventory_logs (ingredient_id, action_type, quantity_change) 
  VALUES (p_ingredient_id, 'manual_order', p_quantity);
END //

DELIMITER ;

-- Event to automatically check inventory daily
CREATE EVENT IF NOT EXISTS check_inventory_event
ON SCHEDULE EVERY 1 MINUTE
DO CALL check_inventory_thresholds();

-- Dump completed on 2024-09-29  0:35:20