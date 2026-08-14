import prisma from "../../src/utils/prisma.js";

export async function seedActivites() {
  console.log("🌱 Début du seed des activités...");

  await prisma.activite.createMany({
    data: [
      // Exercice
      { id: "act1", nom: "Marche rapide de 30 minutes" },
      { id: "act2", nom: "Séance de yoga" },
      { id: "act3", nom: "Course à pied" },
      { id: "act4", nom: "Étirements du matin" },
      { id: "act5", nom: "Vélo en extérieur" },

      // Social
      { id: "act6", nom: "Appeler un proche" },
      { id: "act7", nom: "Déjeuner avec un ami" },
      { id: "act8", nom: "Rejoindre un groupe ou une association" },
      { id: "act9", nom: "Écrire une lettre ou un message à quelqu'un" },
      { id: "act10", nom: "Participer à un événement communautaire" },

      // Travail
      { id: "act11", nom: "Faire une liste de tâches prioritaires" },
      { id: "act12", nom: "Prendre une pause de 10 minutes toutes les heures" },
      { id: "act13", nom: "Organiser son espace de travail" },
      { id: "act14", nom: "Fixer un objectif réalisable pour la journée" },

      // Méditation
      { id: "act15", nom: "Méditation guidée de 10 minutes" },
      { id: "act16", nom: "Exercice de respiration profonde" },
      { id: "act17", nom: "Scan corporel avant de dormir" },
      { id: "act18", nom: "Tenir un journal de gratitude" },

      // Loisirs
      { id: "act19", nom: "Lire un livre" },
      { id: "act20", nom: "Écouter de la musique" },
      { id: "act21", nom: "Cuisiner une nouvelle recette" },
      { id: "act22", nom: "Dessiner ou peindre" },
    ],
    skipDuplicates: true,
  });

  console.log("🌱 Seed des activités terminé !");
}