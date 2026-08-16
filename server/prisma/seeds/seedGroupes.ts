import prisma from "../../src/utils/prisma.js";

export async function seedGroupes() {
  console.log("🌱 Nettoyage de la table Group...");
  await prisma.group.deleteMany({});

  console.log("🌱 Insertion des groupes...");

  const groupeAnxiete = await prisma.group.create({
    data: {
      id: "g1",
      thematique: "Gestion de l'Anxiété",
      description: "Un espace d'entraide pour partager nos astuces contre le stress quotidien.",
      regles: "Respect, bienveillance et confidentialité obligatoires.",
      visibilite: "PUBLIC",
      membres: {
        create: [
          { utilisateurId: "u1", role: "MODERATEUR" },
          { utilisateurId: "u2", role: "MEMBRE" }
        ]
      }
    }
  });

  const groupeSommeil = await prisma.group.create({
    data: {
      id: "g2",
      thematique: "Cercle du Sommeil",
      description: "Groupe privé pour ceux qui cherchent à retrouver un sommeil réparateur.",
      regles: "Pas de spam. Partage d'expériences personnelles uniquement.",
      visibilite: "PRIVE",
      membres: {
        create: [
          { utilisateurId: "u2", role: "MODERATEUR" },
          { utilisateurId: "u3", role: "MEMBRE" }
        ]
      }
    }
  });

  console.log(`✅ Seed des groupes terminé avec succès : "${groupeAnxiete.thematique}" et "${groupeSommeil.thematique}"`);
}


