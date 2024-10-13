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
INSERT INTO `employees` VALUES (1,'Amy','Lee','amy@example.com','Manager',1,'123'),(2,'Bob','Ross','bob@example.com','Waiter',0,'123'),(4,'Taylor','Swift','taylor@example.com','Manager',1,'123');
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
INSERT INTO `inventory` VALUES (1,'mozzarella',50,20,100),(2,'tomato sauce',90,10,100),(3,'dough',90,10,50),(4,'pepperoni',100,50,100),(5,'cheddar cheese',100,20,100),(6,'beef patty',100,20,50),(7,'lettuce',100,20,50),(8,'tomato',100,20,50),(9,'pasta',100,20,50),(10,'chicken',100,20,70),(11,'garlic',100,20,50),(12,'fish fillets',70,10,30),(13,'tortillas',100,20,50),(14,'cabbage',100,20,50),(15,'lime',100,40,50),(16,'sour cream',50,20,50),(17,'milk',100,20,50),(18,'butter',100,30,100),(19,'flour',100,40,200),(20,'hamburger bun',100,20,75),(21,'hot dog sausage',100,20,50),(22,'hot dog bun',100,30,100),(23,'mustard',100,40,100),(24,'ketchup',100,30,100),(25,'relish',50,20,45),(26,'potatoes',100,30,100),(27,'carrots',100,20,60),(28,'mayonnaise',70,10,40),(29,'bread',100,10,40),(30,'corn',100,10,50),(31,'salt',100,40,100),(32,'Sprite',89,20,100),(33,'Coca-Cola',96,20,100),(34,'Pepsi',96,20,100),(35,'Dr. Pepper',96,20,100),(36,'Fanta Orange',0,20,100),(37,'Diet Coke',90,20,100),(38,'Black Tea',100,20,70),(39,'Sugar',100,20,100);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;

--
-- Table structure for table `inventory_daily_summary`
--

DROP TABLE IF EXISTS `inventory_daily_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_daily_summary` (
  `summary_id` int unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `ingredient_id` int unsigned NOT NULL,
  `starting_amount` int unsigned NOT NULL,
  `ending_amount` int unsigned NOT NULL,
  `restocked_amount` int unsigned NOT NULL DEFAULT '0',
  `used_amount` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`summary_id`),
  UNIQUE KEY `date_ingredient` (`date`,`ingredient_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `inventory_daily_summary_ibfk_1` FOREIGN KEY (`ingredient_id`) REFERENCES `inventory` (`ingredient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_daily_summary`
--

/*!40000 ALTER TABLE `inventory_daily_summary` DISABLE KEYS */;
INSERT INTO `inventory_daily_summary` VALUES (1,'2024-10-12',1,50,50,0,0),(2,'2024-10-12',2,90,90,0,0),(3,'2024-10-12',3,90,90,0,0),(4,'2024-10-12',4,100,100,0,0),(5,'2024-10-12',5,100,100,0,0),(6,'2024-10-12',6,100,100,0,0),(7,'2024-10-12',7,100,100,0,0),(8,'2024-10-12',8,100,100,0,0),(9,'2024-10-12',9,100,100,0,0),(10,'2024-10-12',10,100,100,0,0),(11,'2024-10-12',11,100,100,0,0),(12,'2024-10-12',12,70,70,0,0),(13,'2024-10-12',13,100,100,0,0),(14,'2024-10-12',14,100,100,0,0),(15,'2024-10-12',15,100,100,0,0),(16,'2024-10-12',16,50,50,0,0),(17,'2024-10-12',17,100,100,0,0),(18,'2024-10-12',18,100,100,0,0),(19,'2024-10-12',19,100,100,0,0),(20,'2024-10-12',20,100,100,0,0),(21,'2024-10-12',21,100,100,0,0),(22,'2024-10-12',22,100,100,0,0),(23,'2024-10-12',23,100,100,0,0),(24,'2024-10-12',24,100,100,0,0),(25,'2024-10-12',25,50,50,0,0),(26,'2024-10-12',26,100,100,0,0),(27,'2024-10-12',27,100,100,0,0),(28,'2024-10-12',28,70,70,0,0),(29,'2024-10-12',29,100,100,0,0),(30,'2024-10-12',30,100,100,0,0),(31,'2024-10-12',31,100,100,0,0),(32,'2024-10-12',32,89,89,0,0),(33,'2024-10-12',33,96,96,0,0),(34,'2024-10-12',34,96,96,0,0),(35,'2024-10-12',35,96,96,0,0),(36,'2024-10-12',36,0,0,0,0),(37,'2024-10-12',37,90,90,0,0),(38,'2024-10-12',38,100,100,0,0),(39,'2024-10-12',39,100,100,0,0);
/*!40000 ALTER TABLE `inventory_daily_summary` ENABLE KEYS */;

--
-- Table structure for table `inventory_logs`
--

DROP TABLE IF EXISTS `inventory_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_logs` (
  `log_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `ingredient_id` int unsigned NOT NULL,
  `action_type` enum('restock','manual_order','usage') NOT NULL,
  `quantity_change` int NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'In-Queue',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `special_requests` varchar(255) DEFAULT NULL,
  `promoCode_id` int unsigned DEFAULT NULL,
  `table_number` int unsigned NOT NULL,
  `pointsEarned` int unsigned DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_waiter_id` (`waiter_id`),
  KEY `fk_orders_customer_id` (`customer_id`),
  KEY `fk_orders_promoCode_id` (`promoCode_id`),
  CONSTRAINT `fk_orders_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_promoCode_id` FOREIGN KEY (`promoCode_id`) REFERENCES `promotion_codes` (`promoCode_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_waiter_id` FOREIGN KEY (`waiter_id`) REFERENCES `employees` (`employee_id`) ON UPDATE CASCADE,
  CONSTRAINT `chk_orders_status` CHECK ((`status` in (_utf8mb4'In-Queue',_utf8mb4'In-Progress',_utf8mb4'Ready for Pickup',_utf8mb4'Delievered')))
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='receipt and payment info';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'[{\"name\": \"Cheese Pizza\", \"type\": \"main\", \"image\": \"cheese_pizza.jpg\", \"price\": \"15.99\", \"quantity\": 3, \"recipe_id\": 1, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}]}]',1,1,47.97,25,11.99,63.92,64.00,0.08,3.96,'In-Queue','2024-09-29 23:02:50','This is a test for special requests.',NULL,0,NULL),(2,'[{\"name\": \"Cheese Pizza\", \"type\": \"main\", \"image\": \"cheese_pizza.jpg\", \"price\": \"15.99\", \"quantity\": 10, \"recipe_id\": 1, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}]}]',1,1,159.90,20,31.98,205.07,206.00,0.93,13.19,'In-Queue','2024-09-29 23:07:32','',NULL,0,NULL),(3,'[{\"name\": \"Dr. Pepper\", \"type\": \"drink\", \"image\": \"dr-pepper.png\", \"price\": \"1.99\", \"quantity\": 5, \"recipe_id\": 15, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 35}]}]',1,1,9.95,0,0.00,10.77,11.00,0.23,0.82,'In-Queue','2024-09-29 23:09:53','',NULL,0,NULL),(4,'[{\"name\": \"Dr. Pepper\", \"type\": \"drink\", \"image\": \"dr-pepper.png\", \"price\": \"1.99\", \"quantity\": 5, \"recipe_id\": 15, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 35}]}]',1,1,9.95,0,0.00,10.77,11.00,0.23,0.82,'In-Queue','2024-09-30 02:55:15','',NULL,0,NULL),(5,'[{\"name\": \"Dr. Pepper\", \"type\": \"drink\", \"image\": \"dr-pepper.png\", \"price\": \"1.99\", \"quantity\": 5, \"recipe_id\": 15, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 35}]}]',1,1,9.95,0,0.00,10.77,11.00,0.23,0.82,'In-Queue','2024-09-30 03:06:34','',NULL,0,NULL),(6,'[{\"name\": \"Sweet Tea\", \"type\": \"drink\", \"image\": \"sweet_tea.jpg\", \"price\": \"1.99\", \"quantity\": 5, \"recipe_id\": 18, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 38}, {\"quantity\": 5, \"ingredient_id\": 39}]}]',1,1,9.95,15,1.49,12.26,15.00,2.74,0.82,'In-Queue','2024-09-30 03:15:09','Add less sugar',NULL,0,NULL),(7,'[{\"name\": \"Pepperoni Pizza\", \"type\": \"main\", \"image\": \"pepperoni_pizza.jpg\", \"price\": \"15.99\", \"quantity\": 5, \"recipe_id\": 2, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}, {\"quantity\": 20, \"ingredient_id\": 4}]}]',1,1,79.95,15,11.99,98.54,100.00,1.46,6.60,'In-Queue','2024-09-30 03:28:49','Double pepperoni',NULL,0,NULL),(8,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,NULL,1.99,5,0.10,2.25,5.00,2.75,0.16,'In-Queue','2024-09-30 04:37:36','',NULL,0,NULL),(9,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 2, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,NULL,3.98,0,0.00,4.31,5.00,0.69,0.33,'In-Queue','2024-09-30 05:02:47','',NULL,0,NULL),(10,'[{\"name\": \"Fanta Orange\", \"type\": \"drink\", \"image\": \"fanta.png\", \"price\": \"1.99\", \"quantity\": 1, \"recipe_id\": 16, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 36}]}]',1,NULL,1.99,0,0.00,2.15,3.00,0.85,0.16,'In-Queue','2024-09-30 05:06:36','',NULL,0,NULL),(11,'[{\"name\": \"Diet Coke\", \"type\": \"drink\", \"image\": \"diet_coke.png\", \"price\": \"1.99\", \"quantity\": 1, \"recipe_id\": 17, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 37}]}]',1,NULL,1.99,0,0.00,2.15,3.00,0.85,0.16,'In-Queue','2024-09-30 05:08:57','',NULL,0,NULL),(12,'[{\"name\": \"Diet Coke\", \"type\": \"drink\", \"image\": \"diet_coke.png\", \"price\": \"1.99\", \"quantity\": 1, \"recipe_id\": 17, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 37}]}]',1,2,1.99,0,0.00,2.15,3.00,0.85,0.16,'In-Queue','2024-09-30 05:16:18','',NULL,0,NULL),(13,'[{\"name\": \"Diet Coke\", \"type\": \"drink\", \"image\": \"diet_coke.png\", \"price\": \"1.99\", \"quantity\": 5, \"recipe_id\": 17, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 37}]}]',1,NULL,9.95,0,0.00,10.77,11.00,0.23,0.82,'In-Queue','2024-09-30 05:21:05','',NULL,0,NULL),(14,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}, {\"name\": \"Coca-Cola\", \"type\": \"drink\", \"image\": \"coca-cola.png\", \"price\": \"1.99\", \"quantity\": 1, \"recipe_id\": 13, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 33}]}, {\"name\": \"Pepsi\", \"type\": \"drink\", \"image\": \"pepsi.png\", \"price\": \"1.99\", \"quantity\": 1, \"recipe_id\": 14, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 34}]}, {\"name\": \"Dr. Pepper\", \"type\": \"drink\", \"image\": \"dr-pepper.png\", \"price\": \"1.99\", \"quantity\": 1, \"recipe_id\": 15, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 35}]}, {\"name\": \"Diet Coke\", \"type\": \"drink\", \"image\": \"diet_coke.png\", \"price\": \"1.99\", \"quantity\": 1, \"recipe_id\": 17, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 37}]}]',1,NULL,9.95,0,0.00,10.77,11.00,0.23,0.82,'In-Queue','2024-10-01 16:07:51','',NULL,0,NULL),(15,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 2, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}, {\"name\": \"Coca-Cola\", \"type\": \"drink\", \"image\": \"coca-cola.png\", \"price\": \"1.99\", \"quantity\": 2, \"recipe_id\": 13, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 33}]}, {\"name\": \"Pepsi\", \"type\": \"drink\", \"image\": \"pepsi.png\", \"price\": \"1.99\", \"quantity\": 2, \"recipe_id\": 14, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 34}]}, {\"name\": \"Dr. Pepper\", \"type\": \"drink\", \"image\": \"dr-pepper.png\", \"price\": \"1.99\", \"quantity\": 2, \"recipe_id\": 15, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 35}]}, {\"name\": \"Diet Coke\", \"type\": \"drink\", \"image\": \"diet_coke.png\", \"price\": \"1.99\", \"quantity\": 2, \"recipe_id\": 17, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 37}]}]',1,NULL,19.90,25,4.97,26.52,30.00,3.48,1.64,'In-Queue','2024-10-01 16:08:50','',NULL,0,NULL),(16,'[{\"name\": \"Coca-Cola\", \"type\": \"drink\", \"image\": \"coca-cola.png\", \"price\": \"1.99\", \"quantity\": 1, \"recipe_id\": 13, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 33}]}, {\"name\": \"Pepsi\", \"type\": \"drink\", \"image\": \"pepsi.png\", \"price\": \"1.99\", \"quantity\": 1, \"recipe_id\": 14, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 34}]}, {\"name\": \"Dr. Pepper\", \"type\": \"drink\", \"image\": \"dr-pepper.png\", \"price\": \"1.99\", \"quantity\": 1, \"recipe_id\": 15, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 35}]}]',1,NULL,5.97,0,0.00,6.46,10.00,3.54,0.49,'In-Queue','2024-10-01 20:37:14','',NULL,0,NULL),(17,'[{\"name\": \"Cheese Pizza\", \"type\": \"main\", \"image\": \"cheese_pizza.jpg\", \"price\": \"15.99\", \"quantity\": 5, \"is_active\": 1, \"recipe_id\": 1, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}]}]',1,NULL,79.95,5,4.00,90.54,100.00,9.46,6.60,'In-Queue','2024-10-11 20:28:48','Thin crust for 3 pizzas',NULL,30,NULL),(18,'[{\"name\": \"Cheese Pizza\", \"type\": \"main\", \"image\": \"cheese_pizza.jpg\", \"price\": \"15.99\", \"quantity\": 5, \"is_active\": 1, \"recipe_id\": 1, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}]}]',1,NULL,79.95,0,0.00,86.55,90.00,3.45,6.60,'In-Queue','2024-10-11 23:20:54','',NULL,29,NULL),(19,'[{\"name\": \"Sprite\", \"type\": \"drink\", \"image\": \"sprite.png\", \"price\": \"1.99\", \"quantity\": 5, \"is_active\": 1, \"recipe_id\": 12, \"ingredients\": [{\"quantity\": 1, \"ingredient_id\": 32}]}]',1,1,9.95,0,0.00,10.77,11.00,0.23,0.82,'In-Queue','2024-10-12 02:21:00','',NULL,23,9);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `updateInventoryAfterOrder` AFTER INSERT ON `orders` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `addPointsAfterOrder` AFTER INSERT ON `orders` FOR EACH ROW BEGIN
    IF NEW.customer_id IS NOT NULL AND NEW.pointsEarned IS NOT NULL THEN
	    UPDATE users SET points = points + NEW.pointsEarned WHERE user_id = NEW.customer_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_codes`
--

/*!40000 ALTER TABLE `promotion_codes` DISABLE KEYS */;
INSERT INTO `promotion_codes` VALUES (1,'database',10,NULL,1);
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
INSERT INTO `users` VALUES (1,'Mike','Ross','mikeross@gmail.com','mike123','user',1,9),(2,'Tony','Smith','ts@example.com','ts123','user',1,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

--
-- Dumping routines for database 'restaurantdb'
--
/*!50003 DROP PROCEDURE IF EXISTS `generate_daily_inventory_summary` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `generate_daily_inventory_summary`()
BEGIN
    DECLARE report_date DATE;
    SET report_date = CURDATE() - INTERVAL 1 DAY;
    -- Insert or update the inventory_daily_summary table
    INSERT INTO inventory_daily_summary (
        date, 
        ingredient_id, 
        starting_amount, 
        ending_amount, 
        restocked_amount, 
        used_amount
    )
    SELECT 
        report_date,
        i.ingredient_id,
        COALESCE(prev_summary.ending_amount, i.amount) AS starting_amount,
        i.amount AS ending_amount,
        COALESCE(restocked.amount, 0) AS restocked_amount,
        COALESCE(used.amount, 0) AS used_amount
    FROM 
        inventory i
        LEFT JOIN inventory_daily_summary prev_summary ON i.ingredient_id = prev_summary.ingredient_id
            AND prev_summary.date = report_date - INTERVAL 1 DAY
        LEFT JOIN (
            SELECT ingredient_id, SUM(quantity_change) AS amount
            FROM inventory_logs
            WHERE DATE(timestamp) = report_date AND action_type IN ('restock', 'manual_order')
            GROUP BY ingredient_id
        ) restocked ON i.ingredient_id = restocked.ingredient_id
        LEFT JOIN (
            SELECT ingredient_id, SUM(ABS(quantity_change)) AS amount
            FROM inventory_logs
            WHERE DATE(timestamp) = report_date AND action_type = 'usage'
            GROUP BY ingredient_id
        ) used ON i.ingredient_id = used.ingredient_id
    ON DUPLICATE KEY UPDATE
        starting_amount = VALUES(starting_amount),
        ending_amount = VALUES(ending_amount),
        restocked_amount = VALUES(restocked_amount),
        used_amount = VALUES(used_amount);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-13 13:56:49
