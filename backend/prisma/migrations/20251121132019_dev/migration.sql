/*
  Warnings:

  - Added the required column `HomeDelivery` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NParcels` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parcelCode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parcelNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payed` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payedAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientCin` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientCityId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientNum` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sipperId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statut` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `HomeDelivery` BOOLEAN NOT NULL,
    ADD COLUMN `NParcels` INTEGER NOT NULL,
    ADD COLUMN `cityId` INTEGER NOT NULL,
    ADD COLUMN `clientId` INTEGER NOT NULL,
    ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `parcelCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `parcelNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `payed` BOOLEAN NOT NULL,
    ADD COLUMN `payedAmount` DOUBLE NOT NULL,
    ADD COLUMN `productType` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientCin` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientCityId` INTEGER NOT NULL,
    ADD COLUMN `recipientName` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientNum` VARCHAR(191) NOT NULL,
    ADD COLUMN `sipperId` INTEGER NOT NULL,
    ADD COLUMN `statut` ENUM('origin', 'inTransit', 'inStock', 'delivered', 'notDelivered') NOT NULL,
    ADD COLUMN `weight` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `Pic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_sipperId_fkey` FOREIGN KEY (`sipperId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_recipientCityId_fkey` FOREIGN KEY (`recipientCityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pic` ADD CONSTRAINT `Pic_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
