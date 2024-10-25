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
-- Table structure for table `discount_next_visit`
--

DROP TABLE IF EXISTS `discount_next_visit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_next_visit` (
  `user_id` int unsigned NOT NULL,
  `counter` int unsigned NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  KEY `fk_discount_next_visit` (`user_id`),
  CONSTRAINT `fk_discount_next_visit` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_next_visit`
--

/*!40000 ALTER TABLE `discount_next_visit` DISABLE KEYS */;
/*!40000 ALTER TABLE `discount_next_visit` ENABLE KEYS */;

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='employee accounts';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Amy','Lee','amy@example.com','Manager',1,'mpass'),(2,'Bob','Ross','bob@example.com','Waiter',1,'wpass'),(4,'Taylor','Swift','taylor@example.com','Waiter',0,'wpass'),(8,'John','Doe','john@example.com','Accountant',1,'apass');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `event_name` varchar(50) NOT NULL,
  `shift_start_time` datetime DEFAULT NULL,
  `shift_end_time` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;

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
INSERT INTO `inventory` VALUES (1,'mozzarella',80,20,100),(2,'tomato sauce',90,10,100),(3,'dough',80,10,50),(4,'pepperoni',80,50,100),(5,'cheddar cheese',170,20,100),(6,'beef patty',100,20,50),(7,'lettuce',90,20,50),(8,'tomato',100,20,50),(9,'pasta',60,20,50),(10,'chicken',108,20,70),(11,'garlic',87,20,50),(12,'fish fillets',95,10,30),(13,'tortillas',100,20,50),(14,'cabbage',100,20,50),(15,'lime',100,40,50),(16,'sour cream',100,20,50),(17,'milk',90,20,50),(18,'butter',35,30,100),(19,'flour',90,40,200),(20,'hamburger bun',100,20,75),(21,'hot dog sausage',100,20,50),(22,'hot dog bun',100,30,100),(23,'mustard',100,40,100),(24,'ketchup',100,30,100),(25,'relish',100,20,45),(26,'potatoes',100,30,100),(27,'carrots',100,20,60),(28,'mayonnaise',100,10,40),(29,'bread',100,10,40),(30,'corn',80,10,50),(31,'salt',70,40,100),(32,'Sprite',58,20,100),(33,'Coca-Cola',65,20,100),(34,'Pepsi',100,20,100),(35,'Dr. Pepper',100,20,100),(36,'Fanta Orange',0,20,100),(37,'Diet Coke',94,20,100),(38,'Black Tea',99,20,70),(39,'Sugar',95,20,100);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `inventory_changes` BEFORE UPDATE ON `inventory` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `inventory_logs`
--

DROP TABLE IF EXISTS `inventory_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_logs` (
  `log_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `ingredient_id` int unsigned NOT NULL,
  `action_type` enum('restock','used','discarded') NOT NULL,
  `quantity_change` int NOT NULL,
  `log_date` date NOT NULL DEFAULT (curdate()),
  `log_time` time NOT NULL DEFAULT (curtime()),
  PRIMARY KEY (`log_id`),
  KEY `idx_ingredient_date` (`ingredient_id`,`log_date`),
  CONSTRAINT `fk_inventory_logs_ingredient_id` FOREIGN KEY (`ingredient_id`) REFERENCES `inventory` (`ingredient_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='logs for inventory changes';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_logs`
--

/*!40000 ALTER TABLE `inventory_logs` DISABLE KEYS */;
INSERT INTO `inventory_logs` VALUES (1,1,'used',-10,'2024-10-21','21:16:56'),(2,2,'used',-5,'2024-10-21','21:16:56'),(3,3,'used',-5,'2024-10-21','21:16:56'),(4,7,'discarded',-2,'2024-10-21','21:17:42'),(5,8,'discarded',-3,'2024-10-21','21:17:42'),(6,1,'restock',25,'2024-10-21','21:18:15'),(7,1,'used',-10,'2024-10-21','21:25:45'),(8,1,'used',-10,'2024-10-21','21:26:08'),(9,1,'used',-10,'2024-10-21','21:26:12'),(10,1,'used',-10,'2024-10-21','21:26:18'),(11,1,'used',-10,'2024-10-21','21:26:20'),(12,1,'restock',100,'2024-10-21','21:26:20'),(13,38,'used',-1,'2024-10-21','21:38:53'),(14,39,'used',-5,'2024-10-21','21:38:53'),(15,2,'used',-1,'2024-10-22','07:57:52'),(16,1,'used',-5,'2024-10-22','07:57:52'),(17,3,'used',-1,'2024-10-22','07:57:52'),(18,4,'used',-20,'2024-10-22','07:57:52'),(19,37,'used',-1,'2024-10-24','08:27:24'),(20,9,'used',-21,'2024-10-24','15:24:40'),(21,5,'used',-30,'2024-10-24','15:24:40'),(22,17,'used',-9,'2024-10-24','15:24:40'),(23,18,'used',-15,'2024-10-24','15:24:40'),(24,19,'used',-9,'2024-10-24','15:24:40'),(25,9,'used',-50,'2024-10-24','15:25:14'),(26,10,'used',-10,'2024-10-24','15:25:14'),(27,11,'used',-15,'2024-10-24','15:25:14'),(28,5,'restock',100,'2024-10-25','04:38:55'),(29,5,'restock',100,'2024-10-25','04:38:55'),(30,10,'restock',20,'2024-10-25','04:39:13'),(31,10,'restock',20,'2024-10-25','04:39:13'),(32,17,'used',-1,'2024-10-25','04:41:23'),(33,3,'used',-9,'2024-10-25','04:46:08'),(34,3,'restock',9,'2024-10-25','04:49:22'),(35,3,'used',-9,'2024-10-25','04:49:38'),(36,9,'restock',1,'2024-10-25','04:52:12'),(37,9,'used',-5,'2024-10-25','04:52:23'),(38,2,'restock',1,'2024-10-25','04:55:07'),(39,7,'discarded',-4,'2024-10-25','04:57:57'),(40,7,'used',-4,'2024-10-25','04:57:57'),(41,19,'discarded',-1,'2024-10-25','04:58:24'),(42,19,'used',-1,'2024-10-25','04:58:24'),(43,11,'restock',5,'2024-10-25','04:58:53'),(44,12,'discarded',-5,'2024-10-25','04:59:04'),(45,12,'used',-5,'2024-10-25','04:59:04'),(46,1,'restock',5,'2024-10-25','04:59:36'),(47,1,'discarded',-5,'2024-10-25','04:59:42'),(48,1,'used',-5,'2024-10-25','04:59:42'),(49,9,'used',-5,'2024-10-25','05:02:15'),(50,9,'restock',50,'2024-10-25','05:02:15'),(51,1,'used',-10,'2024-10-25','05:09:03'),(52,1,'restock',10,'2024-10-25','05:12:14'),(53,1,'used',-32,'2024-10-25','05:12:35'),(54,1,'discarded',-2,'2024-10-25','05:13:22'),(55,1,'restock',4,'2024-10-25','05:13:35'),(56,9,'used',-10,'2024-10-25','05:14:04'),(57,10,'used',-2,'2024-10-25','05:14:04'),(58,11,'used',-3,'2024-10-25','05:14:04');
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
  `is_active` tinyint unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`recipe_id`),
  CONSTRAINT `chk_menu_type` CHECK ((`type` in (_utf8mb4'main',_utf8mb4'side',_utf8mb4'drink')))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='resturant menu items';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'Cheese Pizza','[{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}]',15.99,'cheese_pizza.jpg','main',1),(2,'Pepperoni Pizza','[{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}, {\"quantity\": 20, \"ingredient_id\": 4}]',15.99,'pepperoni_pizza.jpg','main',1),(3,'Cheese Burger','[{\"quantity\": 2, \"ingredient_id\": 5}, {\"quantity\": 1, \"ingredient_id\": 6}, {\"quantity\": 2, \"ingredient_id\": 7}, {\"quantity\": 2, \"ingredient_id\": 8}, {\"quantity\": 1, \"ingredient_id\": 20}]',7.99,'cheese_burger.jpg','main',1),(4,'Chicken Alfredo','[{\"quantity\": 10, \"ingredient_id\": 9}, {\"quantity\": 2, \"ingredient_id\": 10}, {\"quantity\": 3, \"ingredient_id\": 11}]',10.99,'chicken_alfredo.jpg','main',1),(5,'Fish Tacos','[{\"quantity\": 3, \"ingredient_id\": 12}, {\"quantity\": 5, \"ingredient_id\": 13}, {\"quantity\": 3, \"ingredient_id\": 14}, {\"quantity\": 3, \"ingredient_id\": 15}, {\"quantity\": 4, \"ingredient_id\": 16}]',8.99,'fish_tacos.jpg','main',1),(6,'Mac and Cheese','[{\"quantity\": 7, \"ingredient_id\": 9}, {\"quantity\": 10, \"ingredient_id\": 5}, {\"quantity\": 3, \"ingredient_id\": 17}, {\"quantity\": 5, \"ingredient_id\": 18}, {\"quantity\": 3, \"ingredient_id\": 19}]',4.99,'mac_and_cheese.jpg','side',1),(7,'Hot Dogs','[{\"quantity\": 3, \"ingredient_id\": 21}, {\"quantity\": 3, \"ingredient_id\": 22}, {\"quantity\": 3, \"ingredient_id\": 23}, {\"quantity\": 3, \"ingredient_id\": 24}, {\"quantity\": 5, \"ingredient_id\": 25}]',8.99,'hot_dogs.jpg','main',1),(8,'Mashed Potatoes','[{\"quantity\": 1, \"ingredient_id\": 26}, {\"quantity\": 3, \"ingredient_id\": 18}, {\"quantity\": 1, \"ingredient_id\": 17}, {\"quantity\": 5, \"ingredient_id\": 31}]',4.99,'mashed_potatoes.jpg','side',1),(9,'Coleslaw','[{\"quantity\": 1, \"ingredient_id\": 14}, {\"quantity\": 1, \"ingredient_id\": 27}, {\"quantity\": 2, \"ingredient_id\": 28}]',3.99,'coleslaw.jpg','side',1),(10,'Garlic Bread','[{\"quantity\": 3, \"ingredient_id\": 29}, {\"quantity\": 5, \"ingredient_id\": 18}, {\"quantity\": 3, \"ingredient_id\": 11}]',4.99,'garlic_bread.jpg','side',1),(11,'Corn','[{\"quantity\": 2, \"ingredient_id\": 30}, {\"quantity\": 3, \"ingredient_id\": 31}, {\"quantity\": 5, \"ingredient_id\": 18}]',3.99,'corn.jpg','side',1),(12,'Sprite','[{\"quantity\": 1, \"ingredient_id\": 32}]',1.99,'sprite.png','drink',1),(13,'Coca-Cola','[{\"quantity\": 1, \"ingredient_id\": 33}]',1.99,'coca-cola.png','drink',1),(14,'Pepsi','[{\"quantity\": 1, \"ingredient_id\": 34}]',1.99,'pepsi.png','drink',1),(15,'Dr. Pepper','[{\"quantity\": 1, \"ingredient_id\": 35}]',1.99,'dr-pepper.png','drink',1),(16,'Fanta Orange','[{\"quantity\": 1, \"ingredient_id\": 36}]',1.99,'fanta.png','drink',1),(17,'Diet Coke','[{\"quantity\": 1, \"ingredient_id\": 37}]',1.99,'diet_coke.png','drink',1),(18,'Sweet Tea','[{\"quantity\": 1, \"ingredient_id\": 38}, {\"quantity\": 5, \"ingredient_id\": 39}]',1.99,'sweet_tea.jpg','drink',1);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `items` json NOT NULL COMMENT 'JSON format list of Recipes and Quantity',
  `waiter_id` int unsigned NOT NULL,
  `customer_id` int unsigned DEFAULT NULL,
  `subtotal` decimal(10,2) unsigned NOT NULL,
  `tip_percent` int unsigned NOT NULL,
  `tip_amount` decimal(10,2) unsigned NOT NULL,
  `total` decimal(10,2) unsigned NOT NULL,
  `received_amount` decimal(10,2) unsigned NOT NULL,
  `change_amount` decimal(10,2) unsigned NOT NULL,
  `tax_amount` decimal(10,2) unsigned NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `special_requests` varchar(255) DEFAULT NULL,
  `promoCode_id` int unsigned DEFAULT NULL,
  `table_number` int unsigned NOT NULL,
  `pointsEarned` int unsigned DEFAULT NULL,
  `isMilitary` tinyint unsigned NOT NULL DEFAULT '0',
  `discount_percentage` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_waiter_id` (`waiter_id`),
  KEY `fk_orders_customer_id` (`customer_id`),
  KEY `fk_orders_promoCode_id` (`promoCode_id`),
  CONSTRAINT `fk_orders_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_promoCode_id` FOREIGN KEY (`promoCode_id`) REFERENCES `promotion_codes` (`promoCode_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_waiter_id` FOREIGN KEY (`waiter_id`) REFERENCES `employees` (`employee_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='receipt and payment info';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'[{\"name\": \"Cheese Pizza\", \"type\": \"main\", \"image\": \"cheese_pizza.jpg\", \"price\": \"15.99\", \"quantity\": 5, \"is_active\": 1, \"recipe_id\": 1, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}]}]',1,NULL,79.95,0,0.00,86.55,90.00,3.45,6.60,'2024-10-17 04:50:02','',NULL,5,79,0,0),(2,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 5, \"is_active\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,1,9.95,15,1.49,12.26,15.00,2.74,0.82,'2024-10-17 04:51:46','',NULL,1,9,0,0),(3,'[{\"name\": \"Coca-Cola\", \"type\": \"drink\", \"image\": \"coca-cola.png\", \"price\": \"1.99\", \"quantity\": 10, \"is_active\": 1, \"recipe_id\": 13, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 33}]}]',1,1,19.90,5,0.80,18.03,20.00,1.97,1.31,'2024-10-17 13:28:20','',1,21,19,1,20),(4,'[{\"name\": \"Coca-Cola\", \"type\": \"drink\", \"image\": \"coca-cola.png\", \"price\": \"1.99\", \"quantity\": 15, \"is_active\": 1, \"recipe_id\": 13, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 33}]}]',1,1,29.85,0,0.00,25.85,30.00,4.15,1.97,'2024-10-17 13:31:01','',1,22,29,1,20),(5,'[{\"name\": \"Corn\", \"type\": \"side\", \"image\": \"corn.jpg\", \"price\": \"3.99\", \"quantity\": 5, \"is_active\": 1, \"recipe_id\": 11, \"ingredients\": [{\"quantity\": 2, \"ingredient_id\": 30}, {\"quantity\": 3, \"ingredient_id\": 31}, {\"quantity\": 5, \"ingredient_id\": 18}]}]',1,NULL,19.95,0,0.00,19.44,20.00,0.56,1.48,'2024-10-17 14:50:15','',NULL,3,19,1,10),(6,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 5, \"is_active\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,NULL,9.95,5,0.45,10.14,15.00,4.86,0.74,'2024-10-17 15:34:03','',NULL,5,9,1,10),(7,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 10, \"is_active\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,1,19.90,10,1.59,18.83,20.00,1.17,1.31,'2024-10-17 15:38:17','',1,30,19,1,20),(8,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 10, \"is_active\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,NULL,19.90,0,0.00,17.23,20.00,2.77,1.31,'2024-10-17 15:43:40','',1,22,19,1,20),(9,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 5, \"is_active\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,NULL,9.95,15,1.19,9.81,10.00,0.19,0.66,'2024-10-17 15:52:53','',1,11,9,1,20),(10,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 1, \"is_active\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,NULL,1.99,0,0.00,1.72,2.00,0.28,0.13,'2024-10-17 15:54:54','',1,23,1,1,20),(11,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 1, \"is_active\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,NULL,1.99,0,0.00,1.72,2.00,0.28,0.13,'2024-10-17 15:56:26','',1,1,1,1,20),(12,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 1, \"is_active\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,NULL,1.99,0,0.00,1.72,2.00,0.28,0.13,'2024-10-17 16:00:25','',1,1,1,1,20),(13,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 1, \"is_active\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,NULL,1.99,0,0.00,1.72,2.00,0.28,0.13,'2024-10-17 16:02:16','',1,1,1,1,20),(14,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 3, \"is_active\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,NULL,5.97,0,0.00,5.17,6.00,0.83,0.39,'2024-10-17 16:08:42','',1,3,5,1,20),(15,'[{\"name\": \"Corn\", \"type\": \"side\", \"image\": \"corn.jpg\", \"price\": \"3.99\", \"quantity\": 5, \"is_active\": 1, \"recipe_id\": 11, \"ingredients\": [{\"quantity\": 2, \"ingredient_id\": 30}, {\"quantity\": 3, \"ingredient_id\": 31}, {\"quantity\": 5, \"ingredient_id\": 18}]}]',1,1,19.95,10,1.80,21.23,25.00,3.77,1.48,'2024-10-17 16:12:38','',NULL,5,19,1,10),(16,'[{\"name\": \"Coca-Cola\", \"type\": \"drink\", \"image\": \"coca-cola.png\", \"price\": \"1.99\", \"quantity\": 10, \"is_active\": 1, \"recipe_id\": 13, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 33}]}]',1,NULL,19.90,0,0.00,17.23,20.00,2.77,1.31,'2024-10-17 19:26:00','',1,5,19,1,20),(17,'[{\"name\": \"Diet Coke\", \"type\": \"drink\", \"image\": \"diet_coke.png\", \"price\": \"1.99\", \"quantity\": 5, \"is_active\": 1, \"recipe_id\": 17, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 37}]}]',1,NULL,9.95,0,0.00,9.59,10.00,0.41,0.73,'2024-10-17 19:29:23','',2,5,9,1,11),(18,'[{\"name\": \"Sweet Tea\", \"type\": \"drink\", \"image\": \"sweet_tea.jpg\", \"price\": \"1.99\", \"quantity\": 1, \"is_active\": 1, \"recipe_id\": 18, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 38}, {\"quantity\": 5, \"ingredient_id\": 39}]}]',1,NULL,1.99,0,0.00,2.15,2.15,0.00,0.16,'2024-10-22 02:38:53','',NULL,1,1,1,0),(19,'[{\"name\": \"Pepperoni Pizza\", \"type\": \"main\", \"image\": \"pepperoni_pizza.jpg\", \"price\": \"15.99\", \"quantity\": 1, \"is_active\": 1, \"recipe_id\": 2, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}, {\"quantity\": 20, \"ingredient_id\": 4}]}]',1,NULL,15.99,25,3.60,19.18,30.00,10.82,1.19,'2024-10-22 12:57:52','Extra cheese!',NULL,17,15,1,10),(20,'[{\"name\": \"Diet Coke\", \"type\": \"drink\", \"image\": \"diet_coke.png\", \"price\": \"1.99\", \"quantity\": 1, \"is_active\": 1, \"recipe_id\": 17, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 37}]}]',1,NULL,1.99,0,0.00,2.15,4.00,1.85,0.16,'2024-10-24 13:27:24','',NULL,5,1,1,0),(21,'[{\"name\": \"Mac and Cheese\", \"type\": \"side\", \"image\": \"mac_and_cheese.jpg\", \"price\": \"4.99\", \"quantity\": 3, \"is_active\": 1, \"recipe_id\": 6, \"ingredients\": [{\"quantity\": 7, \"ingredient_id\": 9}, {\"quantity\": 10, \"ingredient_id\": 5}, {\"quantity\": 3, \"ingredient_id\": 17}, {\"quantity\": 5, \"ingredient_id\": 18}, {\"quantity\": 3, \"ingredient_id\": 19}]}]',1,NULL,14.97,25,3.74,19.95,30.00,10.05,1.24,'2024-10-24 20:24:40','',NULL,4,14,1,0),(22,'[{\"name\": \"Chicken Alfredo\", \"type\": \"main\", \"image\": \"chicken_alfredo.jpg\", \"price\": \"10.99\", \"quantity\": 5, \"is_active\": 1, \"recipe_id\": 4, \"ingredients\": [{\"quantity\": 10, \"ingredient_id\": 9}, {\"quantity\": 2, \"ingredient_id\": 10}, {\"quantity\": 3, \"ingredient_id\": 11}]}]',1,NULL,54.95,25,13.74,73.22,100.00,26.78,4.53,'2024-10-24 20:25:14','Alergic to garlic',NULL,12,54,1,0),(23,'[{\"name\": \"Chicken Alfredo\", \"type\": \"main\", \"image\": \"chicken_alfredo.jpg\", \"price\": \"10.99\", \"quantity\": 1, \"is_active\": 1, \"recipe_id\": 4, \"ingredients\": [{\"quantity\": 10, \"ingredient_id\": 9}, {\"quantity\": 2, \"ingredient_id\": 10}, {\"quantity\": 3, \"ingredient_id\": 11}]}]',1,NULL,10.99,10,1.10,13.00,15.00,2.00,0.91,'2024-10-25 10:14:04','',NULL,4,10,1,0);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

--
-- Table structure for table `promotion_codes`
--

DROP TABLE IF EXISTS `promotion_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_codes` (
  `promoCode_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `code` varchar(20) NOT NULL,
  `discount_percent` int unsigned NOT NULL,
  `uses_left` int unsigned DEFAULT NULL COMMENT 'NULL = infinite uses',
  `is_active` tinyint unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`promoCode_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_codes`
--

/*!40000 ALTER TABLE `promotion_codes` DISABLE KEYS */;
INSERT INTO `promotion_codes` VALUES (1,'database',20,18,1),(2,'infinity',11,NULL,1);
/*!40000 ALTER TABLE `promotion_codes` ENABLE KEYS */;

--
-- Table structure for table `redemptions`
--

DROP TABLE IF EXISTS `redemptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `redemptions` (
  `redemption_id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `user_id` int unsigned NOT NULL,
  `reward_id` int unsigned NOT NULL,
  `redemption_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`redemption_id`),
  KEY `fk_user_redemption` (`user_id`),
  KEY `fk_reward_redemption` (`reward_id`),
  CONSTRAINT `fk_reward_redemption` FOREIGN KEY (`reward_id`) REFERENCES `rewards` (`reward_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_user_redemption` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `redemptions`
--

/*!40000 ALTER TABLE `redemptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `redemptions` ENABLE KEYS */;

--
-- Table structure for table `restaurant_sales`
--

DROP TABLE IF EXISTS `restaurant_sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant_sales` (
  `sales_date` date NOT NULL,
  `total_sales` decimal(10,2) unsigned DEFAULT '0.00',
  `total_discounts` decimal(10,2) unsigned DEFAULT '0.00',
  `location` int DEFAULT NULL,
  `total_taxes` decimal(10,2) unsigned DEFAULT '0.00',
  `total_cash` decimal(10,2) unsigned DEFAULT '0.00',
  PRIMARY KEY (`sales_date`),
  UNIQUE KEY `location_UNIQUE` (`location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_sales`
--

/*!40000 ALTER TABLE `restaurant_sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `restaurant_sales` ENABLE KEYS */;

--
-- Table structure for table `rewards`
--

DROP TABLE IF EXISTS `rewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rewards` (
  `reward_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `reward_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `points_required` int unsigned NOT NULL,
  `reward_description` text,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`reward_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `discount_next_visit`;

CREATE TABLE `discount_next_visit`(
  `user_id` int unsigned NOT NULL,
  `counter` int unsigned NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,

  KEY `fk_discount_next_visit` (`user_id`),
  CONSTRAINT `fk_discount_next_visit` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
)ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Dumping data for table `rewards`
--

/*!40000 ALTER TABLE `rewards` DISABLE KEYS */;
/*!40000 ALTER TABLE `rewards` ENABLE KEYS */;

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
INSERT INTO `users` VALUES (1,'Mike','Ross','mikeross@gmail.com','mike123','user',1,104),(2,'Tony','Smith','ts@example.com','ts123','user',1,0);
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

-- Dump completed on 2024-10-25  5:31:37
