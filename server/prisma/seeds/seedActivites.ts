import prisma from "../../src/utils/prisma.js";

export async function seedActivites() {
  console.log("🌱 Début du seed des activités...");

  await prisma.activite.createMany({
    data: [
      // Exercice
      { nom: "Marche rapide de 30 minutes" },
      { nom: "Séance de yoga" },
      { nom: "Course à pied" },
      { nom: "Étirements du matin" },
      { nom: "Vélo en extérieur" },

      // Social
      { nom: "Appeler un proche" },
      { nom: "Déjeuner avec un ami" },
      { nom: "Rejoindre un groupe ou une association" },
      { nom: "Écrire une lettre ou un message à quelqu'un" },
      { nom: "Participer à un événement communautaire" },

      // Travail
      { nom: "Faire une liste de tâches prioritaires" },
      { nom: "Prendre une pause de 10 minutes toutes les heures" },
      { nom: "Organiser son espace de travail" },
      { nom: "Fixer un objectif réalisable pour la journée" },

      // Méditation
      { nom: "Méditation guidée de 10 minutes" },
      { nom: "Exercice de respiration profonde" },
      { nom: "Scan corporel avant de dormir" },
      { nom: "Tenir un journal de gratitude" },

      // Loisirs
      { nom: "Lire un livre" },
      { nom: "Écouter de la musique" },
      { nom: "Cuisiner une nouvelle recette" },
      { nom: "Dessiner ou peindre" },
    ],
    skipDuplicates: true,
  });

  console.log("🌱 Seed des activités terminé !");
}
