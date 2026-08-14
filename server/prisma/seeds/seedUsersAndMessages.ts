import prisma from "../../src/utils/prisma.js";
import bcrypt from "bcryptjs";
import { VisibiliteProfil } from "../../generated/prisma/enums.js";

export async function seedUsersMessages() {
  console.log("🌱 Nettoyage des tables Utilisateur et Message...");
  await prisma.message.deleteMany({});
  await prisma.utilisateur.deleteMany({});

  console.log("🌱 Insertion des utilisateurs...");

  const users = [
    {
      id: "u1",
      courriel: "alice@example.com",
      motDePasse: await bcrypt.hash("Password123!", 10),
      pseudonyme: "AliceZen",
      nom: "Alice Tremblay",
      bio: "Passionnée de bien-être et de méditation.",
      visibilite: VisibiliteProfil.PUBLIC,
    },
    {
      id: "u2",
      courriel: "marc@example.com",
      motDePasse: await bcrypt.hash("Password123!", 10),
      pseudonyme: "MarcCoder",
      nom: "Marc Gagnon",
      bio: "Développeur full-stack amateur de café.",
      visibilite: VisibiliteProfil.GROUPES_SEULEMENT,
    },
    {
      id: "u3",
      courriel: "sara@example.com",
      motDePasse: await bcrypt.hash("Password123!", 10),
      pseudonyme: "SaraMind",
      nom: "Sara Lavoie",
      bio: "Étudiante en psychologie.",
      visibilite: VisibiliteProfil.PUBLIC,
    },
    {
      id: "u4",
      courriel: "luc@example.com",
      motDePasse: await bcrypt.hash("Password123!", 10),
      pseudonyme: "LucSport",
      nom: "Luc Desrosiers",
      bio: "Coach sportif et amateur de plein air.",
      visibilite: VisibiliteProfil.PRIVE,
    },
    {
      id: "u5",
      courriel: "emma@example.com",
      motDePasse: await bcrypt.hash("Password123!", 10),
      pseudonyme: "EmmaRelax",
      nom: "Emma Boucher",
      bio: "J’adore les exercices de respiration.",
      visibilite: VisibiliteProfil.PUBLIC,
    },
    {
      id: "u6",
      courriel: "tom@example.com",
      motDePasse: await bcrypt.hash("Password123!", 10),
      pseudonyme: "TomFocus",
      nom: "Tom Leblanc",
      bio: "Toujours à la recherche de nouvelles techniques de concentration.",
      visibilite: VisibiliteProfil.GROUPES_SEULEMENT,
    },
  ];

  for (const u of users) {
    await prisma.utilisateur.upsert({
      where: { id: u.id },
      update: {},
      create: u,
    });
  }

  console.log("🌱 Insertion des messages...");

  const messages = [
    {
      expediteurId: "u1",
      destinataireId: "u2",
      sujet: "Salut Marc!",
      contenu: "J’ai essayé ton exercice de respiration, c’était super!",
    },
    {
      expediteurId: "u2",
      destinataireId: "u1",
      sujet: "Re: Salut Marc!",
      contenu: "Content que ça t’ait aidée!",
    },
    {
      expediteurId: "u3",
      destinataireId: "u1",
      sujet: "Question",
      contenu: "Tu utilises quelle app pour méditer?",
    },
    {
      expediteurId: "u1",
      destinataireId: "u3",
      sujet: "Re: Question",
      contenu: "J’utilise Insight Timer, c’est vraiment bien.",
    },
    {
      expediteurId: "u5",
      destinataireId: "u3",
      sujet: "Salut Sara",
      contenu: "J’ai vu ton post sur l’anxiété, merci pour le partage!",
    },
    {
      expediteurId: "u3",
      destinataireId: "u5",
      sujet: "Merci!",
      contenu: "Ça me fait plaisir, j’espère que ça pourra aider d’autres.",
    },
    {
      expediteurId: "u6",
      destinataireId: "u2",
      sujet: "Focus",
      contenu: "Tu avais parlé d’un guide pour la concentration, tu l’as encore?",
    },
    {
      expediteurId: "u2",
      destinataireId: "u6",
      sujet: "Re: Focus",
      contenu: "Oui! Je te l’envoie dans quelques minutes.",
    },
    {
      expediteurId: "u1",
      destinataireId: "u5",
      sujet: "Respiration",
      contenu: "Tu devrais essayer la technique 4-7-8, ça marche bien.",
    },
    {
      expediteurId: "u5",
      destinataireId: "u1",
      sujet: "Re: Respiration",
      contenu: "Merci! Je vais tester ça ce soir.",
    },
    {
      expediteurId: "u3",
      destinataireId: "u6",
      sujet: "Études",
      contenu: "Je fais un travail sur la gestion du stress, tu veux participer?",
    },
    {
      expediteurId: "u6",
      destinataireId: "u3",
      sujet: "Re: Études",
      contenu: "Oui, avec plaisir!",
    },
  ];

  for (const m of messages) {
    await prisma.message.create({ data: m });
  }

  console.log("🌱 Seed utilisateurs + messages terminé !");
}
