/*
  Warnings:

  - A unique constraint covering the columns `[utilisateurId,messageId]` on the table `Signalement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[utilisateurId,publicationId]` on the table `Signalement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[utilisateurId,commentaireId]` on the table `Signalement` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "estSuspendu" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Signalement_utilisateurId_messageId_key" ON "Signalement"("utilisateurId", "messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Signalement_utilisateurId_publicationId_key" ON "Signalement"("utilisateurId", "publicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Signalement_utilisateurId_commentaireId_key" ON "Signalement"("utilisateurId", "commentaireId");
