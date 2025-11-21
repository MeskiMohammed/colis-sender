/*
  Warnings:

  - You are about to drop the column `city` on the `clients` table. All the data in the column will be lost.
  - You are about to alter the column `country` on the `clients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - Added the required column `cityId` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clients` DROP COLUMN `city`,
    ADD COLUMN `cityId` INTEGER NOT NULL,
    MODIFY `country` ENUM('Morocco', 'France') NOT NULL;

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
