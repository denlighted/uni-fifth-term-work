/*
  Warnings:

  - You are about to drop the column `passwordResetExpires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `passwordResetExpires`,
    DROP COLUMN `passwordResetToken`,
    ADD COLUMN `password_reset_expires` DATETIME(3) NULL,
    ADD COLUMN `password_reset_token` VARCHAR(191) NULL;
