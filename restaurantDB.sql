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
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `ingredient_id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `amount` int unsigned NOT NULL,
  `restock_threshold` int unsigned NOT NULL,
  `restock_amount` int unsigned NOT NULL,
  PRIMARY KEY (`ingredient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table to hold items';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,'mozzarella',100,20,100),(2,'tomato sauce',100,10,100),(3,'dough',50,10,50),(4,'pepperoni',200,50,100),(5,'cheddar cheese',100,20,100),(6,'beef patty',100,20,50),(7,'lettuce',100,20,50),(8,'tomato',100,20,50),(9,'pasta',100,20,50),(10,'chicken',100,20,70),(11,'garlic',100,20,50),(12,'fish fillets',50,10,30),(13,'tortillas',100,20,50),(14,'cabbage',100,20,50),(15,'lime',100,40,50),(16,'sour cream',50,20,50),(17,'milk',70,20,50),(18,'butter',100,30,100),(19,'flour',100,40,200),(20,'hamburger bun',100,20,75),(21,'hot dog sausage',100,20,50),(22,'hot dog bun',100,30,100),(23,'mustard',100,40,100),(24,'ketchup',100,30,100),(25,'relish',50,20,45),(26,'potatoes',100,30,100),(27,'carrots',100,20,60),(28,'mayonnaise',60,10,40),(29,'bread',100,10,40),(30,'corn',15,10,50),(31,'salt',100,40,100),(32,'Sprite',100,20,100),(33,'Coca-Cola',100,20,100),(34,'Pepsi',100,20,100),(35,'Dr. Pepper',100,20,100),(36,'Fanta Orange',0,20,100),(37,'Diet Coke',100,20,100),(38,'Black Tea',100,20,70),(39,'Sugar',100,20,100);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;

--
-- Table structure for table `logins`
--

DROP TABLE IF EXISTS `logins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `FirstName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LastName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Role` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for storing login information';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logins`
--

/*!40000 ALTER TABLE `logins` DISABLE KEYS */;
INSERT INTO `logins` VALUES (1,'realuser@gmail.com','password','Mike','Smith','Customer'),(4,'manager@gmail.com','mpass','John','Doe','Manager');
/*!40000 ALTER TABLE `logins` ENABLE KEYS */;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `recipe_id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ingredients` json NOT NULL COMMENT 'JSON format list of ingredientID and Quantity',
  `price` decimal(10,2) unsigned NOT NULL,
  `image` varchar(255) NOT NULL COMMENT 'Path to the image',
  `type` varchar(50) NOT NULL COMMENT 'menu type (Ex: main, side, drink)',
  PRIMARY KEY (`recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table to hold items';
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
  `items` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'JSON format list of Recipes and Quantity',
  `waiter_id` int unsigned DEFAULT NULL,
  `table_id` int unsigned DEFAULT NULL,
  `customer_id` int unsigned DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `tip_percent` int unsigned DEFAULT NULL,
  `tip_amount` decimal(10,2) unsigned DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `received_amount` decimal(10,2) DEFAULT NULL,
  `change_amount` decimal(10,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table to hold items';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (9,NULL,999,999,999,61.89,5,3.09,70.09,75.00,4.91,00000005.11);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

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

-- Dump completed on 2024-09-23 23:54:19
