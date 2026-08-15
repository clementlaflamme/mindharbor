/*
  Warnings:

  - You are about to drop the column `groupeId` on the `DemandeAdhesion` table. All the data in the column will be lost.
  - You are about to drop the column `groupeId` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the `Groupe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MembreGroupe` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[groupId,utilisateurId]` on the table `DemandeAdhesion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `DemandeAdhesion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `Publication` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VisibiliteGroup" AS ENUM ('PUBLIC', 'PRIVE');

-- CreateEnum
CREATE TYPE "RoleGroup" AS ENUM ('MODERATEUR', 'MEMBRE');

-- DropForeignKey
ALTER TABLE "DemandeAdhesion" DROP CONSTRAINT "DemandeAdhesion_groupeId_fkey";

-- DropForeignKey
ALTER TABLE "MembreGroupe" DROP CONSTRAINT "MembreGroupe_groupeId_fkey";

-- DropForeignKey
ALTER TABLE "MembreGroupe" DROP CONSTRAINT "MembreGroupe_utilisateurId_fkey";

-- DropForeignKey
ALTER TABLE "Publication" DROP CONSTRAINT "Publication_groupeId_fkey";

-- DropIndex
DROP INDEX "DemandeAdhesion_groupeId_utilisateurId_key";

-- AlterTable
ALTER TABLE "DemandeAdhesion" DROP COLUMN "groupeId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Publication" DROP COLUMN "groupeId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Groupe";

-- DropTable
DROP TABLE "MembreGroupe";

-- DropEnum
DROP TYPE "RoleGroupe";

-- DropEnum
DROP TYPE "VisibiliteGroupe";

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "thematique" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "regles" TEXT NOT NULL,
    "visibilite" "VisibiliteGroup" NOT NULL DEFAULT 'PUBLIC',
    "Creele" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "majle" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembreGroup" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "role" "RoleGroup" NOT NULL DEFAULT 'MEMBRE',
    "rejoindreLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MembreGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MembreGroup_groupId_utilisateurId_key" ON "MembreGroup"("groupId", "utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "DemandeAdhesion_groupId_utilisateurId_key" ON "DemandeAdhesion"("groupId", "utilisateurId");

-- AddForeignKey
ALTER TABLE "MembreGroup" ADD CONSTRAINT "MembreGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembreGroup" ADD CONSTRAINT "MembreGroup_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeAdhesion" ADD CONSTRAINT "DemandeAdhesion_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
