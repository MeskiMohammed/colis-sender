/*
  Warnings:

  - You are about to drop the column `statut` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Order` DROP COLUMN `statut`,
    ADD COLUMN `status` ENUM('origin', 'inTransit', 'inStock', 'delivered', 'notDelivered') NOT NULL DEFAULT 'origin';
