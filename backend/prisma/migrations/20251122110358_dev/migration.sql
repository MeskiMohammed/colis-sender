-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `cin` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `phoneCode` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `cityId` INTEGER NOT NULL,
    `country` ENUM('Morocco', 'France') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parcelNumber` VARCHAR(191) NOT NULL,
    `parcelCode` VARCHAR(191) NOT NULL,
    `shipperId` INTEGER NOT NULL,
    `recipientName` VARCHAR(191) NOT NULL,
    `recipientCin` VARCHAR(191) NOT NULL,
    `homeDelivery` BOOLEAN NOT NULL,
    `recipientCityId` INTEGER NOT NULL,
    `recipientPhone` VARCHAR(191) NOT NULL,
    `recipientPhoneCode` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paid` BOOLEAN NOT NULL,
    `paidAmount` DOUBLE NOT NULL,
    `nParcels` INTEGER NOT NULL,
    `productType` VARCHAR(191) NOT NULL,
    `weight` DOUBLE NOT NULL,
    `statut` ENUM('origin', 'inTransit', 'inStock', 'delivered', 'notDelivered') NOT NULL DEFAULT 'origin',

    UNIQUE INDEX `Order_parcelCode_key`(`parcelCode`),
    INDEX `Order_parcelCode_idx`(`parcelCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `country` ENUM('Morocco', 'France') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_shipperId_fkey` FOREIGN KEY (`shipperId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_recipientCityId_fkey` FOREIGN KEY (`recipientCityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pic` ADD CONSTRAINT `Pic_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
