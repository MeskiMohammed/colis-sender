/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.0.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: colis-sender
-- ------------------------------------------------------
-- Server version	12.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `City`
--

DROP TABLE IF EXISTS `City`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `City` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `country` enum('Morocco','France') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `City`
--

LOCK TABLES `City` WRITE;
/*!40000 ALTER TABLE `City` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `City` VALUES
(1,'Asefi','Morocco'),
(2,'Casa','Morocco'),
(3,'Fes','Morocco'),
(4,'Jadida','Morocco'),
(5,'Kanitra','Morocco'),
(6,'Canne','France'),
(7,'Canne la bocca','France'),
(8,'Dariginyne','France'),
(9,'Farigoge','France'),
(10,'Maresiliya','France'),
(11,'Mounto','France'),
(12,'Nice','France'),
(13,'Ountibe','France'),
(14,'Sate Maksine','France'),
(15,'Vantimilya','France');
/*!40000 ALTER TABLE `City` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Client`
--

DROP TABLE IF EXISTS `Client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `cin` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `phoneCode` varchar(191) NOT NULL,
  `address` varchar(191) NOT NULL,
  `cityId` int(11) NOT NULL,
  `country` enum('Morocco','France') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Client_cityId_fkey` (`cityId`),
  CONSTRAINT `Client_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Client`
--

LOCK TABLES `Client` WRITE;
/*!40000 ALTER TABLE `Client` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Client` VALUES
(1,'mohammed','CD369258','691926735','+212','132 addr',3,'Morocco'),
(2,'mohammed','CD3216541','685741424','+212','asd654465',3,'Morocco');
/*!40000 ALTER TABLE `Client` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Order`
--

DROP TABLE IF EXISTS `Order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parcelNumber` varchar(191) NOT NULL,
  `parcelCode` varchar(191) NOT NULL,
  `shipperId` int(11) NOT NULL,
  `recipientName` varchar(191) NOT NULL,
  `recipientCin` varchar(191) NOT NULL,
  `homeDelivery` tinyint(1) NOT NULL,
  `recipientCityId` int(11) NOT NULL,
  `recipientPhone` varchar(191) NOT NULL,
  `recipientPhoneCode` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `paid` tinyint(1) NOT NULL,
  `paidAmount` double NOT NULL,
  `nParcels` int(11) NOT NULL,
  `productType` varchar(191) NOT NULL,
  `weight` double NOT NULL,
  `status` enum('origin','inTransit','inStock','delivered','notDelivered') NOT NULL DEFAULT 'origin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Order_parcelCode_key` (`parcelCode`),
  KEY `Order_parcelCode_idx` (`parcelCode`),
  KEY `Order_shipperId_fkey` (`shipperId`),
  KEY `Order_recipientCityId_fkey` (`recipientCityId`),
  CONSTRAINT `Order_recipientCityId_fkey` FOREIGN KEY (`recipientCityId`) REFERENCES `City` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Order_shipperId_fkey` FOREIGN KEY (`shipperId`) REFERENCES `Client` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order`
--

LOCK TABLES `Order` WRITE;
/*!40000 ALTER TABLE `Order` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Order` VALUES
(4,'3214','RUzgpK3toy',1,'hamada','ASD1321',1,11,'685474451','+33','2025-11-26 13:26:03.377',1,2000,12,'snidi9at',200,'inTransit');
/*!40000 ALTER TABLE `Order` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Pic`
--

DROP TABLE IF EXISTS `Pic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(191) NOT NULL,
  `orderId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Pic_orderId_fkey` (`orderId`),
  CONSTRAINT `Pic_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pic`
--

LOCK TABLES `Pic` WRITE;
/*!40000 ALTER TABLE `Pic` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Pic` VALUES
(64,'/uploads/images-1764163563429-652716264.jpg',4),
(65,'/uploads/images-1764163563447-112464453.jpg',4);
/*!40000 ALTER TABLE `Pic` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `User` VALUES
(1,'admin@example.com','$2b$12$/G.MioK.eVM1vrn3Y9RQxe/VyJFl9a.P3N0AZwLimiMG7OKF7An3K','2025-11-22 11:04:04.682');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `_prisma_migrations` VALUES
('55836477-70e5-454c-be2e-aa4c556c38bb','93509edeb61800d867ebd4b2ac3ab558e60cb680aa1ca5f2bdd255d1100ad296','2025-11-22 11:03:58.306','20251122110358_dev',NULL,NULL,'2025-11-22 11:03:58.154',1),
('e3e08747-53a0-4fb1-a26a-98d3f9a82a70','4bb626276b5437eee27852ce7a10c94566fe212ad79a533ef64f1b4208efa1d4','2025-11-24 15:44:32.186','20251124154432_dev',NULL,NULL,'2025-11-24 15:44:32.168',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-11-27 10:45:07
