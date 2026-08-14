import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier } from "../middleware/auth.js";
import { id, is } from "zod/locales";
import {
  NiveauContact,
  VisibiliteProfil,
} from "../../generated/prisma/enums.js";
import { Parser } from "@json2csv/plainjs";

const routerMe = Router();

routerMe.patch("/", authentifier, async (req: Request, res: Response) => {
  const idUtilisateur = (req as any).utilisateur.sub;

  const { nom, avatarUrl, bio } = req.body;

  try {
    const user = await prisma.utilisateur.update({
      where: {
        id: idUtilisateur,
      },
      data: {
        ...(nom && { nom }),
        ...(avatarUrl && { avatarUrl }),
        ...(bio && { bio }),
      },
      select: {
        nom: true,
        avatarUrl: true,
        bio: true,
      },
    });
    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ erreur: "Erreur serveur" });
  }
});

routerMe.patch(
  "/privacy",
  authentifier,
  async (req: Request, res: Response) => {
    const idUtilisateur = (req as any).utilisateur.sub;

    const { visibilite, niveauContact } = req.body;

    if (visibilite && !Object.values(VisibiliteProfil).includes(visibilite)) {
      return res.status(400).json({ erreur: "Visibilité invalide." });
    }

    if (
      niveauContact &&
      !Object.values(NiveauContact).includes(niveauContact)
    ) {
      return res.status(400).json({ erreur: "Niveau de contact invalide." });
    }

    try {
      const user = await prisma.utilisateur.update({
        where: {
          id: idUtilisateur,
        },
        data: {
          ...(visibilite && { visibilite }),
          ...(niveauContact && { niveauContact }),
        },
        select: {
          nom: true,
          pseudonyme: true,
          visibilite: true,
          niveauContact: true,
        },
      });
      return res.status(200).json(user);
    } catch (e) {
      return res.status(500).json({ erreur: "Erreur serveur" });
    }
});

routerMe.get("/export", authentifier, async (req: Request, res: Response) => {
  const { format } = req.query;
  const utilisateurId = (req as any).utilisateur.sub;

  try {
    // Joindre toutes les tables contenant de l'information concernant l'utilisateur
    const donneesUtilisateur = await prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      include: {
        entreesJournal: true,
        favoris: true,
        messagesEnvoyes: true,
        messagesRecus: true,
        signalements: true,
        membresGroupes: true,
        demandesAdhesion: true,
        publications: true,
        commentairesGroupe: true,
        blocagesEffectues: true,
        blocagesRecus: true,
      },
    });

    if (!donneesUtilisateur) {
      return res.status(404).json({ message: "Erreur : profil non trouvé" });
    }

    // Extraire les données sensibles
    const { motDePasse, jetonsRefresh, ...donneesSecurisees } =
      donneesUtilisateur as any;

    // Export en format CSV
    if (format === "csv") {
      const parser = new Parser();
      const csv = parser.parse([donneesSecurisees]);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="donnees_mindharbor.csv"',
      );
      return res.status(200).send(csv);
    }

    // Export en format JSON
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="donnees_mindharbor.json"',
    );
    return res.status(200).json(donneesSecurisees);
  } catch (error) {
    console.error("Erreur :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'exportation des données." });
  }
});

routerMe.delete("/", authentifier, async (req: Request, res: Response) => {
  try {
    const utilisateurSupprime = await prisma.utilisateur.delete({
      where: { id: (req as any).utilisateur.sub },
    });

    if (!utilisateurSupprime) {
      return res
        .json(404)
        .json({ message: "Aucun utilisateur n'a été trouvé" });
    }

    res.status(200).json({
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'utilisateur." });
  }
});

export default routerMe;
