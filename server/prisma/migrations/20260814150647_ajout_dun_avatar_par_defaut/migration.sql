/*
  Warnings:

  - Made the column `avatarUrl` on table `Utilisateur` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Utilisateur" ALTER COLUMN "avatarUrl" SET NOT NULL,
ALTER COLUMN "avatarUrl" SET DEFAULT '/public/images/default_avatar.jpg';
