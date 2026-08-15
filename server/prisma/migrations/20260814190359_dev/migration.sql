-- CreateEnum
CREATE TYPE "Role" AS ENUM ('UTILISATEUR', 'ADMIN');

-- CreateEnum
CREATE TYPE "VisibiliteProfil" AS ENUM ('PUBLIC', 'GROUPES_SEULEMENT', 'PRIVE');

-- CreateEnum
CREATE TYPE "NiveauContact" AS ENUM ('PERSONNE', 'TOUT_LE_MONDE');

-- CreateEnum
CREATE TYPE "CategorieSignalement" AS ENUM ('INAPPROPRIE', 'SPAM', 'INQUIETANT');

-- CreateEnum
CREATE TYPE "StatutSignalement" AS ENUM ('EN_ATTENTE', 'TRAITE', 'REJETE');

-- CreateEnum
CREATE TYPE "CategorieRessource" AS ENUM ('ANXIETE', 'SOMMEIL', 'RELATIONS', 'TRAVAIL', 'DEUIL', 'HUMEUR', 'ENERGIE');

-- CreateEnum
CREATE TYPE "VisibiliteGroupe" AS ENUM ('PUBLIC', 'PRIVE');

-- CreateEnum
CREATE TYPE "StatutAdhesion" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE');

-- CreateEnum
CREATE TYPE "RoleGroupe" AS ENUM ('MODERATEUR', 'MEMBRE');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "courriel" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "pseudonyme" TEXT NOT NULL,
    "nom" TEXT,
    "avatarUrl" TEXT NOT NULL DEFAULT '/public/images/default_avatar.jpg',
    "bio" TEXT,
    "role" "Role" NOT NULL DEFAULT 'UTILISATEUR',
    "visibilite" "VisibiliteProfil" NOT NULL DEFAULT 'PUBLIC',
    "niveauContact" "NiveauContact" NOT NULL DEFAULT 'TOUT_LE_MONDE',
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "majLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntreeJournal" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "humeur" INTEGER NOT NULL,
    "energie" INTEGER NOT NULL,
    "sommeil" INTEGER NOT NULL,
    "anxiete" INTEGER NOT NULL,
    "gratitude" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "majLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntreeJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activite" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Activite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiviteJournal" (
    "entreeJournalId" TEXT NOT NULL,
    "activiteId" TEXT NOT NULL,

    CONSTRAINT "ActiviteJournal_pkey" PRIMARY KEY ("entreeJournalId","activiteId")
);

-- CreateTable
CREATE TABLE "Ressource" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "categorie" "CategorieRessource" NOT NULL,
    "type" TEXT NOT NULL,
    "duree" INTEGER NOT NULL,
    "niveau" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "majLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ressource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favori" (
    "utilisateurId" TEXT NOT NULL,
    "ressourceId" TEXT NOT NULL,

    CONSTRAINT "Favori_pkey" PRIMARY KEY ("utilisateurId","ressourceId")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "expediteurId" TEXT NOT NULL,
    "destinataireId" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blocage" (
    "id" TEXT NOT NULL,
    "bloqueurId" TEXT NOT NULL,
    "bloqueId" TEXT NOT NULL,

    CONSTRAINT "Blocage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signalement" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "messageId" TEXT,
    "categorie" "CategorieSignalement" NOT NULL,
    "statut" "StatutSignalement" NOT NULL DEFAULT 'EN_ATTENTE',
    "publicationId" TEXT,
    "commentaireId" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "majLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signalement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JetonRefresh" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "invalide" BOOLEAN NOT NULL DEFAULT false,
    "expireLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JetonRefresh_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "Utilisateur_courriel_key" ON "Utilisateur"("courriel");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_pseudonyme_key" ON "Utilisateur"("pseudonyme");

-- CreateIndex
CREATE UNIQUE INDEX "EntreeJournal_utilisateurId_creeLe_key" ON "EntreeJournal"("utilisateurId", "creeLe");

-- CreateIndex
CREATE UNIQUE INDEX "Activite_nom_key" ON "Activite"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Ressource_url_key" ON "Ressource"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Blocage_bloqueurId_bloqueId_key" ON "Blocage"("bloqueurId", "bloqueId");

-- CreateIndex
CREATE UNIQUE INDEX "JetonRefresh_token_key" ON "JetonRefresh"("token");

-- CreateIndex
CREATE UNIQUE INDEX "MembreGroupe_groupeId_utilisateurId_key" ON "MembreGroupe"("groupeId", "utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "DemandeAdhesion_groupeId_utilisateurId_key" ON "DemandeAdhesion"("groupeId", "utilisateurId");

-- AddForeignKey
ALTER TABLE "EntreeJournal" ADD CONSTRAINT "EntreeJournal_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiviteJournal" ADD CONSTRAINT "ActiviteJournal_entreeJournalId_fkey" FOREIGN KEY ("entreeJournalId") REFERENCES "EntreeJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiviteJournal" ADD CONSTRAINT "ActiviteJournal_activiteId_fkey" FOREIGN KEY ("activiteId") REFERENCES "Activite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_ressourceId_fkey" FOREIGN KEY ("ressourceId") REFERENCES "Ressource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_expediteurId_fkey" FOREIGN KEY ("expediteurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocage" ADD CONSTRAINT "Blocage_bloqueurId_fkey" FOREIGN KEY ("bloqueurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocage" ADD CONSTRAINT "Blocage_bloqueId_fkey" FOREIGN KEY ("bloqueId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_commentaireId_fkey" FOREIGN KEY ("commentaireId") REFERENCES "CommentaireGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JetonRefresh" ADD CONSTRAINT "JetonRefresh_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
