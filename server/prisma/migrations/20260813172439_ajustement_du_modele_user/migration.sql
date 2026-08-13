/*
  Warnings:

  - A unique constraint covering the columns `[pseudonyme]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.
  - Made the column `pseudonyme` on table `Utilisateur` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Utilisateur" ALTER COLUMN "pseudonyme" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_pseudonyme_key" ON "Utilisateur"("pseudonyme");
