# 🧠 MindHarbor
Plateforme de soutien en santé mentale — Projet full-stack (Hackathon 88h, Collège de Maisonneuve)

MindHarbor est une application web conçue pour offrir un espace bienveillant permettant :
- le suivi quotidien du bien-être,
- l’analyse de tendances personnelles,
- l’accès à des ressources éducatives,
- la participation à des groupes de soutien,
- la messagerie privée sécurisée.

Ce projet a été réalisé dans le cadre du hackathon de 88 heures du cours Service Web 25604 – Été 2026, en respectant la pile technologique imposée : TypeScript, Node.js, Express, Prisma, Neon PostgreSQL, React, Axios, JWT.

---

# 🛠️ Marche à suivre (installation complète)

## 📁 Structure générale
Le dépôt contient deux applications distinctes :

mindharbor/
  server/   ← API Express + Prisma + Neon 
  client/   ← Interface React + Axios

Toutes les commandes backend doivent être exécutées dans mindharbor/server.
Toutes les commandes frontend doivent être exécutées dans mindharbor/client.

---

# ⚙️ Installation du backend (server)

## 1. Aller dans le dossier du serveur
cd mindharbor/server

## 2. Installer les dépendances
npm install

## 3. Créer le fichier .env
cp .env.example .env

Variables à remplir :
- DATABASE_URL = lien Neon PostgreSQL
- JWT_SECRET (un long code secret de votre cru)
- CODE_AMIN (voir .env.example pour le code valide pour les tests de test.rest, dans un scénario réel, utilisez un autre code)

## 4. Initialiser Prisma (génération + migrations)
npx prisma generate
npx prisma migrate dev --name init

## 5. Exécuter le seed
Le seed crée :
- 1 admin [admin@example.com | Password123!]
- 1 modérateur [marc@example.com | Password123!]
- 30 entrées dans le journal [alice@example.com | Password123!]
- groupes publics et privés

Dans le dossier /server
npx prisma db seed

## 6. Lancer le serveur Express
npm run dev

Backend disponible sur :
http://localhost:3000

---

# 🖥️ Installation du frontend (client)

## 1. Dans un autre terminal, allez dans le dossier du client
cd mindharbor/client

## 2. Installer les dépendances
npm install

## 3. Lancer l’application React
npm run dev

Interface disponible sur :
http://localhost:5173

---

# 🧬 Modèle Prisma

Le schéma Prisma inclut :
- 13 modèles complets
- 8 enums
- Relations 1-N et N-N
- Contraintes @@unique sur journaux, favoris, adhésions, signalements
- onDelete: Cascade sur les relations pertinentes
- Une transaction pour l’acceptation d’adhésion
- Agrégations Prisma pour les tendances (7/30/90 jours)

---

# 📊 Fonctionnalités livrées

## ✔️ Journal de bien-être
- Une entrée par jour
- Modification jusqu’à minuit
- Activités N-N
- Strictement privé

## ✔️ Analyse & tendances
- Statistiques 7 / 30 / 90 jours
- Graphiques via recharts
- Moyennes des métriques
- Observations sur les données 

## ✔️ Ressources & favoris
- Recherche
- Filtrage par durée, catégorie et niveau
- Gestion des favoris
- Suggestion contextuelle pour les utilisateurs avec un journal
- Ressource récente pour les utilisateurs non connectés

## ✔️ Groupes de soutien
- Groupes publics et privés
- Demandes d’adhésion
- Rôles modérateur / membre
- Publications et commentaires
- Signalements

## ✔️ Messagerie privée
- Niveaux de contact respectés
- Blocage utilisateur
- Messages non lus

---

# 🌐 Pages livrées

- connexion
- inscription
- journal
- ressources
- groupes
- amin
- messagerie
- analyses
- options (profil)

---

# 🔐 Comptes de démonstration (à remplir)

## Admin
Email : admin@example.com
Mot de passe : Password123!

## Modérateur
Email : marc@example.com
Mot de passe : Password123!
Groupe modéré : Cercle du Sommeil (id: g2)

## Utilisateur régulier (30 jours de journal)
Email : alice@example.com
Mot de passe : Password123!

## Utilisateur profil privé
Email : luc@example.com
Mot de passe : Password123!

---

# 👥 Équipe & contributions

## Francis Boisvert
- Analyse & tendances (graphique, route)
- Messagerie privée
- Modèle Prisma (base)

## Clément Laflamme
- Journal de bien-être
- Analyse & tendances (route)
- Profils et confidentialité
- Enregistrement et login

## Mathieu Gosselin
- Ressources & favoris
- Sécurité & JWT, Authentification
- NavBar, Footer, App.tsx
- Wireframes

## Pascale Mercier
- Groupes de soutien

---

# ⚠️ Limitations connues

- Pas de publications/commentaires dans le seed
- Page /me non implémentée
- Dashboard incomplet
- Observations automatiques simplifiées
- Pagination absente sur certains écrans
- Pas de notifications en temps réel

---

# 📄 Licence
Projet académique — Collège de Maisonneuve, été 2026.
