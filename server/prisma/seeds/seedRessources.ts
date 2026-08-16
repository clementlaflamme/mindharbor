import prisma from "../../src/utils/prisma.js";
import { CategorieRessource } from "../../generated/prisma/enums.js";

export async function seedRessources() {
  console.log("🌱 Nettoyage de la table Ressource...");
  await prisma.ressource.deleteMany({});

  console.log("🌱 Insertion des nouvelles ressources...");

  const ressources = [
    // -------------------------
    // ANXIETE (6)
    // -------------------------
    {
      titre: "Breathing Exercise: 4-7-8 Technique",
      contenu: "Technique de respiration pour réduire l’anxiété.",
      url: "https://www.healthline.com/health/4-7-8-breathing",
      categorie: CategorieRessource.ANXIETE,
      type: "exercice",
      duree: 2,
      niveau: 1,
    },
    {
      titre: "What Is Anxiety?",
      contenu: "Explication claire des mécanismes de l’anxiété.",
      url: "https://www.anxietycanada.com/articles/what-is-anxiety/",
      categorie: CategorieRessource.ANXIETE,
      type: "article",
      duree: 5,
      niveau: 2,
    },
    {
      titre: "Grounding Techniques (5-4-3-2-1)",
      contenu: "Méthode sensorielle pour calmer une crise d’angoisse.",
      url: "https://www.therapistaid.com/worksheets/grounding-techniques.pdf",
      categorie: CategorieRessource.ANXIETE,
      type: "guide",
      duree: 3,
      niveau: 1,
    },
    {
      titre: "Anxiety Explained in 10 Minutes",
      contenu: "Vidéo éducative sur l’anxiété.",
      url: "https://www.youtube.com/watch?v=WWloIAQpMcQ",
      categorie: CategorieRessource.ANXIETE,
      type: "video",
      duree: 10,
      niveau: 1,
    },
    {
      titre: "Cognitive Distortions",
      contenu: "Article sur les pensées anxieuses et biais cognitifs.",
      url: "https://www.psychologytoday.com/us/basics/cognitive-distortions",
      categorie: CategorieRessource.ANXIETE,
      type: "article",
      duree: 7,
      niveau: 2,
    },
    {
      titre: "Progressive Muscle Relaxation",
      contenu: "Exercice de relaxation musculaire pour réduire l’anxiété.",
      url: "https://www.anxietycanada.com/articles/how-to-do-progressive-muscle-relaxation/",
      categorie: CategorieRessource.ANXIETE,
      type: "exercice",
      duree: 5,
      niveau: 1,
    },

    // -------------------------
    // SOMMEIL (6)
    // -------------------------
    {
      titre: "Sleep Hygiene Guide",
      contenu: "Conseils pour améliorer la qualité du sommeil.",
      url: "https://www.sleepfoundation.org/sleep-hygiene",
      categorie: CategorieRessource.SOMMEIL,
      type: "article",
      duree: 7,
      niveau: 1,
    },
    {
      titre: "Guided Sleep Meditation",
      contenu: "Méditation guidée pour s’endormir.",
      url: "https://www.youtube.com/watch?v=ZToicYcHIOU",
      categorie: CategorieRessource.SOMMEIL,
      type: "audio",
      duree: 10,
      niveau: 1,
    },
    {
      titre: "Stretching Before Bed",
      contenu: "Étirements pour favoriser l’endormissement.",
      url: "https://www.healthline.com/health/stretching-before-bed",
      categorie: CategorieRessource.SOMMEIL,
      type: "exercice",
      duree: 4,
      niveau: 1,
    },
    {
      titre: "Understanding Insomnia",
      contenu: "Article sur les causes de l’insomnie.",
      url: "https://www.sleepfoundation.org/insomnia",
      categorie: CategorieRessource.SOMMEIL,
      type: "article",
      duree: 8,
      niveau: 2,
    },
    {
      titre: "Breathing to Fall Asleep",
      contenu: "Technique de respiration pour réduire l’agitation mentale.",
      url: "https://www.healthline.com/health/4-7-8-breathing-to-help-you-fall-asleep",
      categorie: CategorieRessource.SOMMEIL,
      type: "exercice",
      duree: 3,
      niveau: 1,
    },
    {
      titre: "Optimize Your Sleep Environment",
      contenu: "Vidéo sur l’hygiène du sommeil.",
      url: "https://www.youtube.com/watch?v=gbQyZcFhQF0",
      categorie: CategorieRessource.SOMMEIL,
      type: "video",
      duree: 6,
      niveau: 1,
    },

    // -------------------------
    // RELATIONS (6)
    // -------------------------
    {
      titre: "Active Listening Skills",
      contenu: "Guide pour améliorer l’écoute active.",
      url: "https://www.mindtools.com/a5v7p3p/active-listening",
      categorie: CategorieRessource.RELATIONS,
      type: "guide",
      duree: 6,
      niveau: 2,
    },
    {
      titre: "Attachment Styles",
      contenu: "Article sur les styles d’attachement.",
      url: "https://www.psychologytoday.com/us/basics/attachment",
      categorie: CategorieRessource.RELATIONS,
      type: "article",
      duree: 10,
      niveau: 3,
    },
    {
      titre: "Healthy Conflict Resolution",
      contenu: "Vidéo éducative sur la gestion des conflits.",
      url: "https://www.youtube.com/watch?v=KY5TWVz5ZDU",
      categorie: CategorieRessource.RELATIONS,
      type: "video",
      duree: 8,
      niveau: 2,
    },
    {
      titre: "Expressing Gratitude",
      contenu: "Exercice pour renforcer les liens affectifs.",
      url: "https://positivepsychology.com/gratitude-exercises/",
      categorie: CategorieRessource.RELATIONS,
      type: "exercice",
      duree: 5,
      niveau: 1,
    },
    {
      titre: "Setting Healthy Boundaries",
      contenu: "Guide pour établir des limites personnelles.",
      url: "https://psychcentral.com/health/setting-boundaries",
      categorie: CategorieRessource.RELATIONS,
      type: "guide",
      duree: 7,
      niveau: 2,
    },
    {
      titre: "Love Languages Explained",
      contenu: "Article sur les langages de l’amour.",
      url: "https://www.5lovelanguages.com/",
      categorie: CategorieRessource.RELATIONS,
      type: "article",
      duree: 6,
      niveau: 1,
    },

    // -------------------------
    // TRAVAIL (6)
    // -------------------------
    {
      titre: "Managing Work Stress",
      contenu: "Article sur la gestion du stress au travail.",
      url: "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/workplace-stress/art-20043887",
      categorie: CategorieRessource.TRAVAIL,
      type: "article",
      duree: 8,
      niveau: 2,
    },
    {
      titre: "Mindfulness at Work",
      contenu: "Exercice de pleine conscience pour le bureau.",
      url: "https://www.mindful.org/mindfulness-at-work/",
      categorie: CategorieRessource.TRAVAIL,
      type: "exercice",
      duree: 3,
      niveau: 1,
    },
    {
      titre: "Burnout Prevention",
      contenu: "Article sur la prévention du burnout.",
      url: "https://www.helpguide.org/articles/stress/burnout-prevention-and-recovery.htm",
      categorie: CategorieRessource.TRAVAIL,
      type: "article",
      duree: 10,
      niveau: 3,
    },
    {
      titre: "Time Management Tips",
      contenu: "Vidéo sur l’organisation du travail.",
      url: "https://www.youtube.com/watch?v=jV6iJ8Wc5yE",
      categorie: CategorieRessource.TRAVAIL,
      type: "video",
      duree: 9,
      niveau: 2,
    },
    {
      titre: "Microbreak Exercises",
      contenu: "Exercices rapides pour réduire la tension musculaire.",
      url: "https://www.healthline.com/health/microbreaks",
      categorie: CategorieRessource.TRAVAIL,
      type: "exercice",
      duree: 2,
      niveau: 1,
    },
    {
      titre: "Improving Concentration",
      contenu: "Guide pour augmenter sa concentration.",
      url: "https://www.healthline.com/health/how-to-improve-concentration",
      categorie: CategorieRessource.TRAVAIL,
      type: "guide",
      duree: 7,
      niveau: 2,
    },

    // -------------------------
    // DEUIL (6)
    // -------------------------
    {
      titre: "Understanding Grief",
      contenu: "Article expliquant les étapes du deuil.",
      url: "https://www.psychologytoday.com/us/basics/grief",
      categorie: CategorieRessource.DEUIL,
      type: "article",
      duree: 10,
      niveau: 2,
    },
    {
      titre: "Coping With Loss",
      contenu: "Guide pour traverser un deuil.",
      url: "https://www.cancer.org/treatment/end-of-life-care/grief-and-loss/coping-with-loss.html",
      categorie: CategorieRessource.DEUIL,
      type: "guide",
      duree: 7,
      niveau: 2,
    },
    {
      titre: "Meditation for Grief",
      contenu: "Audio de méditation pour apaiser la tristesse.",
      url: "https://www.youtube.com/watch?v=1ZYbU82GVz4",
      categorie: CategorieRessource.DEUIL,
      type: "audio",
      duree: 6,
      niveau: 1,
    },
    {
      titre: "Helping Someone in Grief",
      contenu: "Conseils pour soutenir un proche en deuil.",
      url: "https://www.helpguide.org/articles/grief/helping-someone-who-is-grieving.htm",
      categorie: CategorieRessource.DEUIL,
      type: "guide",
      duree: 7,
      niveau: 2,
    },
    {
      titre: "Myths About Grief",
      contenu: "Article démystifiant les idées reçues sur le deuil.",
      url: "https://www.verywellmind.com/common-myths-about-grief-4178251",
      categorie: CategorieRessource.DEUIL,
      type: "article",
      duree: 9,
      niveau: 2,
    },
    {
      titre: "Living With Loss",
      contenu: "Vidéo éducative sur l’acceptation et la reconstruction.",
      url: "https://www.youtube.com/watch?v=Q1kTz6uJZz8",
      categorie: CategorieRessource.DEUIL,
      type: "video",
      duree: 8,
      niveau: 2,
    },
    {
      titre: "10 astuces pour booster vos niveaux d’énergie",
      contenu: "Site web de ressources sur le bien-être",
      url: "https://www.yhttps://www.pressesante.com/fatigue-10-astuces-pour-booster-vos-niveaux-denergie/outube.com/watch?v=Q1kTz6uJZz8",
      categorie: CategorieRessource.ENERGIE,
      type: "article",
      duree: 8,
      niveau: 1,
    },
    {
      titre: "Retrouver sa bonne humeur",
      contenu: "Plusieurs méthodes pour retrouver le moral",
      url: "https://www.amway.ca/fr_CA/discover/nutrition/ways-to-naturally-boost-your-mood",
      categorie: CategorieRessource.HUMEUR,
      type: "article",
      duree: 15,
      niveau: 1,
    },
  ];

  for (const r of ressources) {
    await prisma.ressource.upsert({
      where: { url: r.url },
      update: {},
      create: r,
    });
  }

  console.log("🌱 Seed terminé !");
}
