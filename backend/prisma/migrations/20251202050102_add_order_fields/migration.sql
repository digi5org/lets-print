-- AlterTable
ALTER TABLE `orders` ADD COLUMN `dueDate` DATETIME(3) NULL,
    ADD COLUMN `priority` VARCHAR(191) NULL DEFAULT 'Medium',
    ADD COLUMN `tenantId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `orders_tenantId_idx` ON `orders`(`tenantId`);

-- CreateIndex
CREATE INDEX `orders_status_idx` ON `orders`(`status`);
