/*
  Warnings:

  - The values [Morocco] on the enum `cities_country` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `cities` MODIFY `country` ENUM('Maroc', 'France') NOT NULL;
