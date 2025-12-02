-- CreateTable
CREATE TABLE `deliveries` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `customerPhone` VARCHAR(191) NULL,
    `deliveryAddress` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Scheduled',
    `driverName` VARCHAR(191) NULL,
    `driverPhone` VARCHAR(191) NULL,
    `vehicleNumber` VARCHAR(191) NULL,
    `trackingNumber` VARCHAR(191) NOT NULL,
    `estimatedDelivery` DATETIME(3) NULL,
    `actualDelivery` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `deliveryProof` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `deliveries_trackingNumber_key`(`trackingNumber`),
    INDEX `deliveries_tenantId_idx`(`tenantId`),
    INDEX `deliveries_orderId_idx`(`orderId`),
    INDEX `deliveries_status_idx`(`status`),
    INDEX `deliveries_trackingNumber_idx`(`trackingNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `deliveries` ADD CONSTRAINT `deliveries_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
