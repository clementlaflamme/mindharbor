/*
  Warnings:

  - You are about to drop the column `date` on the `EntreeJournal` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[utilisateurId,creeLe]` on the table `EntreeJournal` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `categorie` on the `Ressource` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategorieRessource" AS ENUM ('ANXIETE', 'SOMMEIL', 'RELATIONS', 'TRAVAIL', 'DEUIL');

-- DropIndex
DROP INDEX "EntreeJournal_utilisateurId_date_key";

-- AlterTable
ALTER TABLE "EntreeJournal" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "Ressource" DROP COLUMN "categorie",
ADD COLUMN     "categorie" "CategorieRessource" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EntreeJournal_utilisateurId_creeLe_key" ON "EntreeJournal"("utilisateurId", "creeLe");
