-- MySQL dump 10.13  Distrib 9.0.1, for Win64 (x86_64)
--
-- Host: localhost    Database: restaurantdb
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
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

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Amy','Lee','amy@example.com','Manager',1,'123'),(2,'Bob','Ross','bob@example.com','Waiter',0,'123'),(3,'Sam','Do','sam@example.com','Chef',0,'123'),(4,'Taylor','Swift','taylor@example.com','Manager',1,'123'),(5,'Dan','Pie','dan@example.com','Chef',0,'123'),(6,'Daz','Pir','daz@example.com','Chef',0,'123'),(7,'Daz','Pir','daz@example.com','Chef',0,'123');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

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

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,'mozzarella',75,20,100),(2,'tomato sauce',95,10,100),(3,'dough',95,10,50),(4,'pepperoni',100,50,100),(5,'cheddar cheese',100,20,100),(6,'beef patty',100,20,50),(7,'lettuce',100,20,50),(8,'tomato',100,20,50),(9,'pasta',100,20,50),(10,'chicken',100,20,70),(11,'garlic',100,20,50),(12,'fish fillets',70,10,30),(13,'tortillas',100,20,50),(14,'cabbage',100,20,50),(15,'lime',100,40,50),(16,'sour cream',50,20,50),(17,'milk',100,20,50),(18,'butter',100,30,100),(19,'flour',100,40,200),(20,'hamburger bun',100,20,75),(21,'hot dog sausage',100,20,50),(22,'hot dog bun',100,30,100),(23,'mustard',100,40,100),(24,'ketchup',100,30,100),(25,'relish',50,20,45),(26,'potatoes',100,30,100),(27,'carrots',100,20,60),(28,'mayonnaise',70,10,40),(29,'bread',100,10,40),(30,'corn',100,10,50),(31,'salt',100,40,100),(32,'Sprite',97,20,100),(33,'Coca-Cola',100,20,100),(34,'Pepsi',100,20,100),(35,'Dr. Pepper',100,20,100),(36,'Fanta Orange',0,20,100),(37,'Diet Coke',93,20,100),(38,'Black Tea',100,20,70),(39,'Sugar',100,20,100);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

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

LOCK TABLES `inventory_logs` WRITE;
/*!40000 ALTER TABLE `inventory_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_logs` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`recipe_id`),
  CONSTRAINT `chk_menu_type` CHECK ((`type` in (_utf8mb4'main',_utf8mb4'side',_utf8mb4'drink')))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='resturant menu items';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'Cheese Pizza','[{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}]',15.99,'cheese_pizza.jpg','main'),(2,'Pepperoni Pizza','[{\"quantity\": 1, \"ingredient_id\": 2}, {\"quantity\": 5, \"ingredient_id\": 1}, {\"quantity\": 1, \"ingredient_id\": 3}, {\"quantity\": 20, \"ingredient_id\": 4}]',15.99,'pepperoni_pizza.jpg','main'),(3,'Cheese Burger','[{\"quantity\": 2, \"ingredient_id\": 5}, {\"quantity\": 1, \"ingredient_id\": 6}, {\"quantity\": 2, \"ingredient_id\": 7}, {\"quantity\": 2, \"ingredient_id\": 8}, {\"quantity\": 1, \"ingredient_id\": 20}]',7.99,'cheese_burger.jpg','main'),(4,'Chicken Alfredo','[{\"quantity\": 10, \"ingredient_id\": 9}, {\"quantity\": 2, \"ingredient_id\": 10}, {\"quantity\": 3, \"ingredient_id\": 11}]',10.99,'chicken_alfredo.jpg','main'),(5,'Fish Tacos','[{\"quantity\": 3, \"ingredient_id\": 12}, {\"quantity\": 5, \"ingredient_id\": 13}, {\"quantity\": 3, \"ingredient_id\": 14}, {\"quantity\": 3, \"ingredient_id\": 15}, {\"quantity\": 4, \"ingredient_id\": 16}]',8.99,'fish_tacos.jpg','main'),(6,'Mac and Cheese','[{\"quantity\": 7, \"ingredient_id\": 9}, {\"quantity\": 10, \"ingredient_id\": 5}, {\"quantity\": 3, \"ingredient_id\": 17}, {\"quantity\": 5, \"ingredient_id\": 18}, {\"quantity\": 3, \"ingredient_id\": 19}]',4.99,'mac_and_cheese.jpg','side'),(7,'Hot Dogs','[{\"quantity\": 3, \"ingredient_id\": 21}, {\"quantity\": 3, \"ingredient_id\": 22}, {\"quantity\": 3, \"ingredient_id\": 23}, {\"quantity\": 3, \"ingredient_id\": 24}, {\"quantity\": 5, \"ingredient_id\": 25}]',8.99,'hot_dogs.jpg','main'),(8,'Mashed Potatoes','[{\"quantity\": 1, \"ingredient_id\": 26}, {\"quantity\": 3, \"ingredient_id\": 18}, {\"quantity\": 1, \"ingredient_id\": 17}, {\"quantity\": 5, \"ingredient_id\": 31}]',4.99,'mashed_potatoes.jpg','side'),(9,'Coleslaw','[{\"quantity\": 1, \"ingredient_id\": 14}, {\"quantity\": 1, \"ingredient_id\": 27}, {\"quantity\": 2, \"ingredient_id\": 28}]',3.99,'coleslaw.jpg','side'),(10,'Garlic Bread','[{\"quantity\": 3, \"ingredient_id\": 29}, {\"quantity\": 5, \"ingredient_id\": 18}, {\"quantity\": 3, \"ingredient_id\": 11}]',4.99,'garlic_bread.jpg','side'),(11,'Corn','[{\"quantity\": 2, \"ingredient_id\": 30}, {\"quantity\": 3, \"ingredient_id\": 31}, {\"quantity\": 5, \"ingredient_id\": 18}]',3.99,'corn.jpg','side'),(12,'Sprite','[{\"quantity\": 1, \"ingredient_id\": 32}]',1.99,'sprite.png','drink'),(13,'Coca-Cola','[{\"quantity\": 1, \"ingredient_id\": 33}]',1.99,'coca-cola.png','drink'),(14,'Pepsi','[{\"quantity\": 1, \"ingredient_id\": 34}]',1.99,'pepsi.png','drink'),(15,'Dr. Pepper','[{\"quantity\": 1, \"ingredient_id\": 35}]',1.99,'dr-pepper.png','drink'),(16,'Fanta Orange','[{\"quantity\": 1, \"ingredient_id\": 36}]',1.99,'fanta.png','drink'),(17,'Diet Coke','[{\"quantity\": 1, \"ingredient_id\": 37}]',1.99,'diet_coke.png','drink'),(18,'Sweet Tea','[{\"quantity\": 1, \"ingredient_id\": 38}, {\"quantity\": 5, \"ingredient_id\": 39}]',1.99,'sweet_tea.jpg','drink');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

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
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `special_requests` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_waiter_id` (`waiter_id`),
  KEY `fk_orders_table_id` (`table_id`),
  KEY `fk_orders_customer_id` (`customer_id`),
  CONSTRAINT `fk_orders_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_table_id` FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`table_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_waiter_id` FOREIGN KEY (`waiter_id`) REFERENCES `employees` (`employee_id`) ON UPDATE CASCADE,
  CONSTRAINT `chk_orders_status` CHECK ((`status` in (_utf8mb4'In-Queue',_utf8mb4'In-Progress',_utf8mb4'Ready for Pickup',_utf8mb4'Delievered')))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='receipt and payment info';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'[{\"recipe_id\":1,\"name\":\"Cheese Pizza\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":2},{\"quantity\":5,\"ingredient_id\":1},{\"quantity\":1,\"ingredient_id\":3}],\"price\":\"15.99\",\"image\":\"cheese_pizza.jpg\",\"type\":\"main\",\"quantity\":3}]',1,1,1,47.97,25,11.99,63.92,64.00,0.08,3.96,'In-Queue','2024-09-29 23:02:50','This is a test for special requests.'),(2,'[{\"recipe_id\":1,\"name\":\"Cheese Pizza\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":2},{\"quantity\":5,\"ingredient_id\":1},{\"quantity\":1,\"ingredient_id\":3}],\"price\":\"15.99\",\"image\":\"cheese_pizza.jpg\",\"type\":\"main\",\"quantity\":10}]',1,1,1,159.90,20,31.98,205.07,206.00,0.93,13.19,'In-Queue','2024-09-29 23:07:32',''),(3,'[{\"recipe_id\":15,\"name\":\"Dr. Pepper\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":35}],\"price\":\"1.99\",\"image\":\"dr-pepper.png\",\"type\":\"drink\",\"quantity\":5}]',1,1,1,9.95,0,0.00,10.77,11.00,0.23,0.82,'In-Queue','2024-09-29 23:09:53',''),(4,'[{\"recipe_id\":15,\"name\":\"Dr. Pepper\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":35}],\"price\":\"1.99\",\"image\":\"dr-pepper.png\",\"type\":\"drink\",\"quantity\":5}]',1,1,1,9.95,0,0.00,10.77,11.00,0.23,0.82,'In-Queue','2024-09-30 02:55:15',''),(5,'[{\"recipe_id\":15,\"name\":\"Dr. Pepper\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":35}],\"price\":\"1.99\",\"image\":\"dr-pepper.png\",\"type\":\"drink\",\"quantity\":5}]',1,1,1,9.95,0,0.00,10.77,11.00,0.23,0.82,'In-Queue','2024-09-30 03:06:34',''),(6,'[{\"recipe_id\":18,\"name\":\"Sweet Tea\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":38},{\"quantity\":5,\"ingredient_id\":39}],\"price\":\"1.99\",\"image\":\"sweet_tea.jpg\",\"type\":\"drink\",\"quantity\":5}]',1,1,1,9.95,15,1.49,12.26,15.00,2.74,0.82,'In-Queue','2024-09-30 03:15:09','Add less sugar'),(7,'[{\"recipe_id\":2,\"name\":\"Pepperoni Pizza\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":2},{\"quantity\":5,\"ingredient_id\":1},{\"quantity\":1,\"ingredient_id\":3},{\"quantity\":20,\"ingredient_id\":4}],\"price\":\"15.99\",\"image\":\"pepperoni_pizza.jpg\",\"type\":\"main\",\"quantity\":5}]',1,1,1,79.95,15,11.99,98.54,100.00,1.46,6.60,'In-Queue','2024-09-30 03:28:49','Double pepperoni'),(8,'[{\"recipe_id\":12,\"name\":\"Sprite\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":32}],\"price\":\"1.99\",\"image\":\"sprite.png\",\"type\":\"drink\",\"quantity\":1}]',1,1,NULL,1.99,5,0.10,2.25,5.00,2.75,0.16,'In-Queue','2024-09-30 04:37:36',''),(9,'[{\"recipe_id\":12,\"name\":\"Sprite\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":32}],\"price\":\"1.99\",\"image\":\"sprite.png\",\"type\":\"drink\",\"quantity\":2}]',1,1,NULL,3.98,0,0.00,4.31,5.00,0.69,0.33,'In-Queue','2024-09-30 05:02:47',''),(10,'[{\"recipe_id\":16,\"name\":\"Fanta Orange\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":36}],\"price\":\"1.99\",\"image\":\"fanta.png\",\"type\":\"drink\",\"quantity\":1}]',1,1,NULL,1.99,0,0.00,2.15,3.00,0.85,0.16,'In-Queue','2024-09-30 05:06:36',''),(11,'[{\"recipe_id\":17,\"name\":\"Diet Coke\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":37}],\"price\":\"1.99\",\"image\":\"diet_coke.png\",\"type\":\"drink\",\"quantity\":1}]',1,1,NULL,1.99,0,0.00,2.15,3.00,0.85,0.16,'In-Queue','2024-09-30 05:08:57',''),(12,'[{\"recipe_id\":17,\"name\":\"Diet Coke\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":37}],\"price\":\"1.99\",\"image\":\"diet_coke.png\",\"type\":\"drink\",\"quantity\":1}]',1,1,2,1.99,0,0.00,2.15,3.00,0.85,0.16,'In-Queue','2024-09-30 05:16:18',''),(13,'[{\"recipe_id\":17,\"name\":\"Diet Coke\",\"ingredients\":[{\"quantity\":1,\"ingredient_id\":37}],\"price\":\"1.99\",\"image\":\"diet_coke.png\",\"type\":\"drink\",\"quantity\":5}]',1,1,NULL,9.95,0,0.00,10.77,11.00,0.23,0.82,'In-Queue','2024-09-30 05:21:05','');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

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

LOCK TABLES `redemptions` WRITE;
/*!40000 ALTER TABLE `redemptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `redemptions` ENABLE KEYS */;
UNLOCK TABLES;

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
  CONSTRAINT `fk_restaurant_tables_waiter_id` FOREIGN KEY (`waiter_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_tables_status` CHECK ((`status` in (_utf8mb4'Free',_utf8mb4'In-Use',_utf8mb4'Dirty')))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='every table in the restuarant';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_tables`
--

LOCK TABLES `restaurant_tables` WRITE;
/*!40000 ALTER TABLE `restaurant_tables` DISABLE KEYS */;
INSERT INTO `restaurant_tables` VALUES (1,NULL,NULL,'Free');
/*!40000 ALTER TABLE `restaurant_tables` ENABLE KEYS */;
UNLOCK TABLES;

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

LOCK TABLES `rewards` WRITE;
/*!40000 ALTER TABLE `rewards` DISABLE KEYS */;
/*!40000 ALTER TABLE `rewards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shifts` (
  `shift_id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `employee_id` int unsigned DEFAULT NULL,
  `shift_start_time` datetime DEFAULT NULL,
  `shift_end_time` datetime DEFAULT NULL,
  `is_filled` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`shift_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `shifts_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shifts`
--

LOCK TABLES `shifts` WRITE;
/*!40000 ALTER TABLE `shifts` DISABLE KEYS */;
/*!40000 ALTER TABLE `shifts` ENABLE KEYS */;
UNLOCK TABLES;

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

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Mike','Ross','mikeross@gmail.com','mike123','user',1,0),(2,'Tony','Smith','ts@example.com','ts123','user',1,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-30 16:46:51
