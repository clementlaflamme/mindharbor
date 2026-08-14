import prisma from "../../src/utils/prisma.js";

export async function seedActivitesJournal() {
  const utilisateurId = 'u1';

  // Nettoyage préalable si nécessaire
    await prisma.entreeJournal.deleteMany({
    where: { utilisateurId },
  });

  const entrees = [
    // --- SEMAINE 1 : Période stable et positive (Bon sommeil, humeur haute, anxiété basse) ---
    {
      utilisateurId,
      humeur: 8,
      energie: 8,
      sommeil: 8,
      anxiete: 2,
      gratitude: 'Bonne nuit réparatrice et café au soleil.',
      creeLe: new Date('2026-07-20T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 9,
      energie: 9,
      sommeil: 8,
      anxiete: 1,
      gratitude: 'Super séance d’entraînement ce matin.',
      creeLe: new Date('2026-07-21T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 7,
      energie: 7,
      sommeil: 7,
      anxiete: 3,
      gratitude: 'Discussion enrichissante avec un collègue.',
      creeLe: new Date('2026-07-22T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 8,
      energie: 8,
      sommeil: 8,
      anxiete: 2,
      gratitude: 'Projet terminé dans les temps.',
      creeLe: new Date('2026-07-23T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 9,
      energie: 8,
      sommeil: 9,
      anxiete: 1,
      gratitude: 'Le début du week-end qui s’annonce calme.',
      creeLe: new Date('2026-07-24T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 9,
      energie: 9,
      sommeil: 9,
      anxiete: 1,
      gratitude: 'Balade en nature ressourçante.',
      creeLe: new Date('2026-07-25T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 8,
      energie: 7,
      sommeil: 8,
      anxiete: 2,
      gratitude: 'Repas partagé en famille.',
      creeLe: new Date('2026-07-26T08:00:00Z'),
    },

    // --- SEMAINE 2 : Pic de stress / fatigue (Sommeil en baisse, anxiété élevée, humeur en déclin) ---
    {
      utilisateurId,
      humeur: 6,
      energie: 5,
      sommeil: 6,
      anxiete: 5,
      gratitude: 'Avoir pu faire une petite pause cet après-midi.',
      creeLe: new Date('2026-07-27T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 4,
      energie: 4,
      sommeil: 5,
      anxiete: 7,
      gratitude: 'Un message réconfortant reçu.',
      creeLe: new Date('2026-07-28T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 3,
      energie: 3,
      sommeil: 4,
      anxiete: 8,
      gratitude: null,
      creeLe: new Date('2026-07-29T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 4,
      energie: 3,
      sommeil: 4,
      anxiete: 9,
      gratitude: 'La tisane chaude avant de dormir.',
      creeLe: new Date('2026-07-30T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 5,
      energie: 4,
      sommeil: 5,
      anxiete: 8,
      gratitude: 'La fin d’une semaine très exigeante.',
      creeLe: new Date('2026-07-31T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 6,
      energie: 5,
      sommeil: 7,
      anxiete: 6,
      gratitude: 'Avoir pu dormir un peu plus longtemps.',
      creeLe: new Date('2026-08-01T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 6,
      energie: 6,
      sommeil: 7,
      anxiete: 5,
      gratitude: 'Un après-midi tranquille de lecture.',
      creeLe: new Date('2026-08-02T08:00:00Z'),
    },

    // --- SEMAINE 3 : Récupération progressive et équilibre modéré ---
    {
      utilisateurId,
      humeur: 7,
      energie: 6,
      sommeil: 7,
      anxiete: 4,
      gratitude: 'Une reprise du travail dans le calme.',
      creeLe: new Date('2026-08-03T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 7,
      energie: 7,
      sommeil: 8,
      anxiete: 3,
      gratitude: 'Séance de méditation très efficace.',
      creeLe: new Date('2026-08-04T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 8,
      energie: 7,
      sommeil: 8,
      anxiete: 3,
      gratitude: 'Un coucher de soleil splendide.',
      creeLe: new Date('2026-08-05T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 7,
      energie: 8,
      sommeil: 7,
      anxiete: 4,
      gratitude: 'Avoir préparé un bon repas sain.',
      creeLe: new Date('2026-08-06T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 8,
      energie: 8,
      sommeil: 8,
      anxiete: 2,
      gratitude: 'La satisfaction d’une semaine productive.',
      creeLe: new Date('2026-08-07T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 9,
      energie: 9,
      sommeil: 9,
      anxiete: 2,
      gratitude: 'Sortie entre amis.',
      creeLe: new Date('2026-08-08T08:00:00Z'),
    },
    {
      utilisateurId,
      humeur: 8,
      energie: 8,
      sommeil: 8,
      anxiete: 2,
      gratitude: 'Prêt et motivé pour attaquer la suite.',
      creeLe: new Date('2026-08-09T08:00:00Z'),
    },
  ];

  await prisma.entreeJournal.createMany({
    data: entrees,
  });

  console.log(`Seed complété : ${entrees.length} entrées créées pour l'utilisateur ${utilisateurId}.`);
}