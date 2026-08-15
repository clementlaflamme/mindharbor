import prisma from "../../src/utils/prisma.js";

export async function seedSignalements() {
  console.log("🌱 Début du seed des signalements...");

  // Nettoyage préalable si nécessaire
  await prisma.signalement.deleteMany();

  const signalements = [
    {
      id: "sig1",
      utilisateurId: "u1",
      categorie: "INQUIETANT" as const,
    },
    {
      id: "sig2",
      utilisateurId: "u2",
      categorie: "SPAM" as const,
    },
    {
      id: "sig3",
      utilisateurId: "u3",
      categorie: "INAPPROPRIE" as const,
    },
    {
      id: "sig4",
      utilisateurId: "u4",
      categorie: "INQUIETANT" as const,
    },
    {
      id: "sig5",
      utilisateurId: "u5",
      categorie: "SPAM" as const,
    },
    {
      id: "sig6",
      utilisateurId: "u6",
      categorie: "INAPPROPRIE" as const,
    },
    {
      id: "sig7",
      utilisateurId: "u1",
      categorie: "SPAM" as const,
    },
    {
      id: "sig8",
      utilisateurId: "u2",
      categorie: "INQUIETANT" as const,
    },
    {
      id: "sig9",
      utilisateurId: "u3",
      categorie: "INAPPROPRIE" as const,
    },
    {
      id: "sig10",
      utilisateurId: "u4",
      categorie: "SPAM" as const,
    },
    {
      id: "sig11",
      utilisateurId: "u5",
      categorie: "INQUIETANT" as const,
    },
    {
      id: "sig12",
      utilisateurId: "u6",
      categorie: "INAPPROPRIE" as const,
    },
  ];

  await prisma.signalement.createMany({
    data: signalements,
    skipDuplicates: true,
  });

  console.log(`🌱 Seed des signalements terminé ! (${signalements.length} signalements créés)`);
}