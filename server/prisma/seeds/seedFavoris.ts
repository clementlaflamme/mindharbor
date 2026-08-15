import prisma from "../../src/utils/prisma.js";

export async function seedFavoris() {

  console.log("🌱 Nettoyage de la table Favori...");
  await prisma.favori.deleteMany({});

  console.log("🌱 Début du seed de la table Favori...");
  const utilisateurs = await prisma.utilisateur.findMany({ take: 3 });
  const ressources = await prisma.ressource.findMany({ take: 3 });

  if (utilisateurs.length === 0 || ressources.length === 0) {
    console.error(
      'Erreur : Il faut au moins 1 utilisateur et 1 ressource en BDD avant de seeder les favoris.'
    );
    return;
  }

  // créer les paires de id
  const favorisData = [
    {
      utilisateurId: utilisateurs[0]!.id,
      ressourceId: ressources[0]!.id,
    }]
    
    if (utilisateurs[1] && ressources[1]) {
        favorisData.push({
            utilisateurId: utilisateurs[1].id,
            ressourceId: ressources[1].id,
        })};
    
    if (utilisateurs[2] && ressources[2]) {
        favorisData.push({
            utilisateurId: utilisateurs[2].id,
            ressourceId: ressources[2].id,
        })};


  await prisma.favori.createMany({
    data: favorisData,
  });

  console.log("🌱 Seed terminé !");
}