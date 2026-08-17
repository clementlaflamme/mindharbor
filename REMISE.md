# Remise — Hackathon MindHarbor

**Cours :** Service Web — Groupe 25604 — Session Été 2026  
**Équipe :** The Hackaton Survivors  
**Date de remise :** 2026-08-16 23:59

---

## 1. Dépôt GitHub

- **URL (public) :** <https://github.com/clementlaflamme/mindharbor>
- **Commit final à corriger :** 48457e0
- **Branche :** main
- [x] Vérifié en navigation privée : le dépôt est bien **PUBLIC**.

---

## 2. Membres de l'équipe

| # | Prénom | Nom | Compte GitHub |
|---|--------|-----|---------------|
| 1 | Mathieu | Gosselin | Grindy |
| 2 | Françis | Boivert | powemetal |
| 3 | Clément | Laflamme | clementlaflamme |
| 4 | Pascale | Mercier | Pascal-the-dog |


---

## 3. Comptes de démonstration

| Rôle | Courriel | Mot de passe | Particularité |
|------|----------|--------------|---------------|
| Administrateur | admin@example.com | Password123! | — |
| Modérateur | marc@example.com | Password123! | modère le groupe: Cercle du Sommeil (selon la bdd mais non implémentée) |
| Utilisateur | alice@example.com | Password123! | 30 jours de journal |
| Utilisateur | luc@example.com | Password123! | profil privé |

---

## 4. État du projet

### Noyau obligatoire

| Fonctionnalité | État | Remarque |
|----------------|------|----------|
| Journal de bien-être | Incomplet | Les activitées n'ont pas été implementées |
| Analyse et tendances | Incomplet | Ne peut être completé sans l'implementation des activitées |
| Ressources et favoris | Complet | |
| Groupes de soutien | Incomplet | Aucune utilisation de l'API et de la base de donnes|
| Messagerie et confidentialité | Complet | |
| Profils et visibilité | Complet | |
| Tableau de bord | Absent | Manque de temps |
| Administration | Absent | Manque de temps |

### Extensions réalisées

Aucune

### Non terminé / limitations connues

- Le visuel en globalité est simple
- Les écrans administration sont manquants
- Les messages d'erreur ne sont pas normalisés et sont parfois génériques. 
- On ne peut pas entrer d'activités dans le journal.
- L'exportation des données du profil n'est pas implémentée
- La base de données Neon PostgreSQL stocke les dates en UTC, tandis que le frontend utilise la date locale (UTC‑4).
Après 20h, la date locale et la date UTC ne correspondent plus : le backend considère que nous sommes déjà au lendemain a partir de ce moment. Cela provoque un décalage d’un jour et les journaux sont enregistrés en date du lendemain.
- En date du dimanche 16 aout à 23:10, aucune connexion entre les groupes et la base de donnes (aucune utilisation de l'api dans le front end)  


---

## 5. Notre part de créativité

Nous avons opté pour un style d'interface simple avec des couleurs douces et agréables pour récomforter les utilsateurs lors de leurs visites.  

---

## 6. Vérifications avant dépôt

- [ ] `npx tsc --noEmit` passe sans erreur dans `server/` **et** dans `client/`  
`(erreurs dans la partie des groupes)`  

- [x] Le projet s'installe et démarre en suivant le README, sur une machine vierge
- [x] La base Neon est peuplée et restera accessible après la remise
- [x] Aucun fichier `.env` n'est commité ; les `.env.example` sont présents
- [ ] Le scénario de validation de l'énoncé a été déroulé en entier  
`(le scenario ne peut se derouler completement car la partie des routes ne fonctionne pas)`  

- [x] Le dépôt est public et le lien ci-dessus fonctionne en navigation privée
