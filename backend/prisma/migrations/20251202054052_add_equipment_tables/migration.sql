-- CreateTable
CREATE TABLE `equipment` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `equipmentType` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NULL,
    `serialNumber` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Operational',
    `lastMaintenance` DATETIME(3) NULL,
    `nextMaintenance` DATETIME(3) NULL,
    `maintenanceNotes` TEXT NULL,
    `purchaseDate` DATETIME(3) NULL,
    `warrantyExpiry` DATETIME(3) NULL,
    `supplier` VARCHAR(191) NULL,
    `cost` DOUBLE NULL,
    `location` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `equipment_tenantId_idx`(`tenantId`),
    INDEX `equipment_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_maintenance` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `maintenanceType` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `cost` DOUBLE NULL,
    `performedBy` VARCHAR(191) NULL,
    `performedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nextDueDate` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `equipment_maintenance_equipmentId_idx`(`equipmentId`),
    INDEX `equipment_maintenance_performedAt_idx`(`performedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `equipment_maintenance` ADD CONSTRAINT `equipment_maintenance_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
