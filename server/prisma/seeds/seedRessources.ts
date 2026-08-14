import prisma from "../../src/utils/prisma.js";

export async function seedRessources() {
  console.log("🌱 Début du seed des ressources...");

  await prisma.ressource.createMany({
    data: [
      // -------------------------
      // ANXIETE (6 ressources)
      // -------------------------
      {
        titre: "Respiration 4-7-8 pour calmer l’anxiété",
        contenu:
          "Technique de respiration guidée pour réduire l’anxiété rapidement.",
        url: "https://mindharbor.ca/respiration-478",
        categorie: "ANXIETE",
        type: "exercice",
        duree: 2,
        niveau: 1,
      },
      {
        titre: "Comprendre les pensées anxieuses",
        contenu: "Article expliquant les pensées automatiques et leur impact.",
        url: "https://mindharbor.ca/pensees-anxieuses",
        categorie: "ANXIETE",
        type: "article",
        duree: 5,
        niveau: 2,
      },
      {
        titre: "Méditation anti-stress de 5 minutes",
        contenu: "Méditation courte pour réduire le stress et l’anxiété.",
        url: "https://mindharbor.ca/meditation-anti-stress",
        categorie: "ANXIETE",
        type: "audio",
        duree: 5,
        niveau: 1,
      },
      {
        titre: "Exercice d’ancrage sensoriel",
        contenu: "Technique pour revenir au moment présent en cas d’anxiété.",
        url: "https://mindharbor.ca/ancrage-sensoriel",
        categorie: "ANXIETE",
        type: "exercice",
        duree: 3,
        niveau: 1,
      },
      {
        titre: "Guide de gestion des crises d’angoisse",
        contenu: "Stratégies pour gérer les crises d’angoisse efficacement.",
        url: "https://mindharbor.ca/crises-angoisse",
        categorie: "ANXIETE",
        type: "guide",
        duree: 10,
        niveau: 2,
      },
      {
        titre: "Vidéo : comprendre l’anxiété en 10 minutes",
        contenu: "Vidéo éducative sur les mécanismes de l’anxiété.",
        url: "https://mindharbor.ca/video-anxiete",
        categorie: "ANXIETE",
        type: "video",
        duree: 10,
        niveau: 1,
      },

      // -------------------------
      // SOMMEIL (6 ressources)
      // -------------------------
      {
        titre: "Routine de sommeil réparateur",
        contenu: "Conseils pratiques pour améliorer la qualité du sommeil.",
        url: "https://mindharbor.ca/routine-sommeil",
        categorie: "SOMMEIL",
        type: "article",
        duree: 7,
        niveau: 1,
      },
      {
        titre: "Méditation guidée pour s’endormir",
        contenu: "Audio de méditation douce pour faciliter l’endormissement.",
        url: "https://mindharbor.ca/meditation-sommeil",
        categorie: "SOMMEIL",
        type: "audio",
        duree: 10,
        niveau: 1,
      },
      {
        titre: "Étirements avant le coucher",
        contenu:
          "Séquence d’étirements pour détendre le corps avant de dormir.",
        url: "https://mindharbor.ca/etirements-sommeil",
        categorie: "SOMMEIL",
        type: "exercice",
        duree: 4,
        niveau: 1,
      },
      {
        titre: "Comprendre l’insomnie",
        contenu:
          "Article expliquant les causes de l’insomnie et les solutions.",
        url: "https://mindharbor.ca/insomnie",
        categorie: "SOMMEIL",
        type: "article",
        duree: 8,
        niveau: 2,
      },
      {
        titre: "Respiration pour s’endormir",
        contenu: "Technique de respiration pour réduire l’agitation mentale.",
        url: "https://mindharbor.ca/respiration-sommeil",
        categorie: "SOMMEIL",
        type: "exercice",
        duree: 3,
        niveau: 1,
      },
      {
        titre: "Vidéo : comment créer un environnement propice au sommeil",
        contenu:
          "Conseils pour optimiser sa chambre et son hygiène de sommeil.",
        url: "https://mindharbor.ca/video-environnement-sommeil",
        categorie: "SOMMEIL",
        type: "video",
        duree: 6,
        niveau: 1,
      },

      // -------------------------
      // RELATIONS (6 ressources)
      // -------------------------
      {
        titre: "Communiquer ses besoins dans une relation",
        contenu: "Guide pour exprimer ses besoins émotionnels sans conflit.",
        url: "https://mindharbor.ca/communication-besoins",
        categorie: "RELATIONS",
        type: "article",
        duree: 6,
        niveau: 2,
      },
      {
        titre: "Exercice d’écoute active",
        contenu: "Petit exercice pour améliorer l’écoute dans les relations.",
        url: "https://mindharbor.ca/ecoute-active",
        categorie: "RELATIONS",
        type: "exercice",
        duree: 4,
        niveau: 1,
      },
      {
        titre: "Vidéo : gérer les conflits de manière saine",
        contenu: "Vidéo éducative sur la résolution de conflits.",
        url: "https://mindharbor.ca/video-conflits",
        categorie: "RELATIONS",
        type: "video",
        duree: 8,
        niveau: 2,
      },
      {
        titre: "Comprendre les styles d’attachement",
        contenu: "Article expliquant les styles d’attachement et leur impact.",
        url: "https://mindharbor.ca/styles-attachement",
        categorie: "RELATIONS",
        type: "article",
        duree: 10,
        niveau: 3,
      },
      {
        titre: "Exercice : exprimer sa gratitude à un proche",
        contenu: "Activité pour renforcer les liens affectifs.",
        url: "https://mindharbor.ca/gratitude-relation",
        categorie: "RELATIONS",
        type: "exercice",
        duree: 5,
        niveau: 1,
      },
      {
        titre: "Guide : reconnaître les limites personnelles",
        contenu: "Apprendre à identifier et respecter ses limites.",
        url: "https://mindharbor.ca/limites-personnelles",
        categorie: "RELATIONS",
        type: "guide",
        duree: 7,
        niveau: 2,
      },

      // -------------------------
      // TRAVAIL (6 ressources)
      // -------------------------
      {
        titre: "Gérer le stress au travail",
        contenu: "Stratégies pour réduire le stress professionnel.",
        url: "https://mindharbor.ca/stress-travail",
        categorie: "TRAVAIL",
        type: "article",
        duree: 8,
        niveau: 2,
      },
      {
        titre: "Pause de pleine conscience au bureau",
        contenu:
          "Exercice rapide pour se recentrer pendant une journée chargée.",
        url: "https://mindharbor.ca/pause-pleine-conscience",
        categorie: "TRAVAIL",
        type: "exercice",
        duree: 3,
        niveau: 1,
      },
      {
        titre: "Vidéo : organiser sa journée efficacement",
        contenu: "Conseils pour mieux gérer son temps au travail.",
        url: "https://mindharbor.ca/video-organisation",
        categorie: "TRAVAIL",
        type: "video",
        duree: 9,
        niveau: 2,
      },
      {
        titre: "Comprendre l’épuisement professionnel",
        contenu: "Article sur les signes du burnout et comment le prévenir.",
        url: "https://mindharbor.ca/burnout",
        categorie: "TRAVAIL",
        type: "article",
        duree: 10,
        niveau: 3,
      },
      {
        titre: "Exercice : micro-pauses actives",
        contenu: "Petits mouvements pour réduire la tension musculaire.",
        url: "https://mindharbor.ca/micro-pauses",
        categorie: "TRAVAIL",
        type: "exercice",
        duree: 2,
        niveau: 1,
      },
      {
        titre: "Guide : améliorer sa concentration",
        contenu: "Techniques pour rester concentré plus longtemps.",
        url: "https://mindharbor.ca/concentration",
        categorie: "TRAVAIL",
        type: "guide",
        duree: 7,
        niveau: 2,
      },

      // -------------------------
      // DEUIL (6 ressources)
      // -------------------------
      {
        titre: "Comprendre le processus du deuil",
        contenu: "Article expliquant les différentes étapes du deuil.",
        url: "https://mindharbor.ca/etapes-deuil",
        categorie: "DEUIL",
        type: "article",
        duree: 10,
        niveau: 2,
      },
      {
        titre: "Exercice d’écriture pour apaiser le deuil",
        contenu: "Activité d’écriture pour exprimer ses émotions.",
        url: "https://mindharbor.ca/ecriture-deuil",
        categorie: "DEUIL",
        type: "exercice",
        duree: 5,
        niveau: 1,
      },
      {
        titre: "Vidéo : vivre avec la perte",
        contenu: "Vidéo éducative sur l’acceptation et la reconstruction.",
        url: "https://mindharbor.ca/video-deuil",
        categorie: "DEUIL",
        type: "video",
        duree: 8,
        niveau: 2,
      },
      {
        titre: "Guide : accompagner un proche en deuil",
        contenu: "Conseils pour soutenir quelqu’un qui traverse un deuil.",
        url: "https://mindharbor.ca/soutenir-deuil",
        categorie: "DEUIL",
        type: "guide",
        duree: 7,
        niveau: 2,
      },
      {
        titre: "Méditation pour apaiser la tristesse",
        contenu:
          "Audio de méditation douce pour traverser les émotions difficiles.",
        url: "https://mindharbor.ca/meditation-deuil",
        categorie: "DEUIL",
        type: "audio",
        duree: 6,
        niveau: 1,
      },
      {
        titre: "Article : mythes sur le deuil",
        contenu: "Démystification des idées reçues sur le processus de deuil.",
        url: "https://mindharbor.ca/mythes-deuil",
        categorie: "DEUIL",
        type: "article",
        duree: 9,
        niveau: 2,
      },
    ],
  });

  console.log("🌱 Seed terminé !");
}
