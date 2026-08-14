-- CreateEnum
CREATE TYPE "VisibiliteGroupe" AS ENUM ('PUBLIC', 'PRIVE');

-- CreateEnum
CREATE TYPE "StatutAdhesion" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE');

-- CreateEnum
CREATE TYPE "RoleGroupe" AS ENUM ('MODERATEUR', 'MEMBRE');

-- AlterTable
ALTER TABLE "Signalement" ADD COLUMN     "commentaireId" TEXT,
ADD COLUMN     "publicationId" TEXT;

-- CreateTable
CREATE TABLE "Groupe" (
    "id" TEXT NOT NULL,
    "thematique" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "regles" TEXT NOT NULL,
    "visibilite" "VisibiliteGroupe" NOT NULL DEFAULT 'PUBLIC',
    "Creele" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "majle" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Groupe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembreGroupe" (
    "id" TEXT NOT NULL,
    "groupeId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "role" "RoleGroupe" NOT NULL DEFAULT 'MEMBRE',
    "rejoindreLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MembreGroupe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandeAdhesion" (
    "id" TEXT NOT NULL,
    "groupeId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "presentation" TEXT NOT NULL,
    "statut" "StatutAdhesion" NOT NULL DEFAULT 'EN_ATTENTE',
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "majLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemandeAdhesion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "groupeId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "majLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentaireGroup" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "CreeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentaireGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MembreGroupe_groupeId_utilisateurId_key" ON "MembreGroupe"("groupeId", "utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "DemandeAdhesion_groupeId_utilisateurId_key" ON "DemandeAdhesion"("groupeId", "utilisateurId");

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_commentaireId_fkey" FOREIGN KEY ("commentaireId") REFERENCES "CommentaireGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembreGroupe" ADD CONSTRAINT "MembreGroupe_groupeId_fkey" FOREIGN KEY ("groupeId") REFERENCES "Groupe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembreGroupe" ADD CONSTRAINT "MembreGroupe_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeAdhesion" ADD CONSTRAINT "DemandeAdhesion_groupeId_fkey" FOREIGN KEY ("groupeId") REFERENCES "Groupe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeAdhesion" ADD CONSTRAINT "DemandeAdhesion_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_groupeId_fkey" FOREIGN KEY ("groupeId") REFERENCES "Groupe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaireGroup" ADD CONSTRAINT "CommentaireGroup_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaireGroup" ADD CONSTRAINT "CommentaireGroup_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
