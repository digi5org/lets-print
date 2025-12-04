-- CreateTable
CREATE TABLE `tenant_products` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `customPrice` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `tenant_products_tenantId_idx`(`tenantId`),
    INDEX `tenant_products_productId_idx`(`productId`),
    INDEX `tenant_products_isActive_idx`(`isActive`),
    UNIQUE INDEX `tenant_products_tenantId_productId_key`(`tenantId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable: Add new fields to products table
ALTER TABLE `products` 
  ADD COLUMN `specifications` JSON NULL,
  ADD COLUMN `createdBy` VARCHAR(191) NULL,
  DROP FOREIGN KEY IF EXISTS `products_tenantId_fkey`,
  DROP COLUMN IF EXISTS `tenantId`;

-- CreateIndex
CREATE INDEX `products_category_idx` ON `products`(`category`);
CREATE INDEX `products_isActive_idx` ON `products`(`isActive`);

-- AddForeignKey
ALTER TABLE `tenant_products` ADD CONSTRAINT `tenant_products_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tenant_products` ADD CONSTRAINT `tenant_products_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
