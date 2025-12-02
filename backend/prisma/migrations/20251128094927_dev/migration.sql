/*
  Warnings:

  - A unique constraint covering the columns `[cin]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipientCin]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Client_cin_key` ON `Client`(`cin`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_recipientCin_key` ON `Order`(`recipientCin`);
