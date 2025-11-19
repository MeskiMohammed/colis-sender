/*
  Warnings:

  - The values [Maroc] on the enum `cities_country` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `cities` MODIFY `country` ENUM('Morocco', 'France') NOT NULL;
