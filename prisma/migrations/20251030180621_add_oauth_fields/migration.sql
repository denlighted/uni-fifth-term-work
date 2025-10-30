-- AlterTable
ALTER TABLE `users` ADD COLUMN `picture_url` VARCHAR(191) NULL,
    ADD COLUMN `provider` VARCHAR(191) NULL,
    ADD COLUMN `provider_id` VARCHAR(191) NULL;
