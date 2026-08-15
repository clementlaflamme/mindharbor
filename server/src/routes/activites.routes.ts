import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middleware/auth.js";

const routerActivites = Router();

//GET /activities Public -- ressort le nom de toutes les activites de la table Activite
routerActivites.get("/", async (req: Request, res: Response) => {
  try {
    const activites = await prisma.activite.findMany({ select: { nom: true } });
    if (!activites)
      return res
        .status(404)
        .json({ erreur: "Erreur: Activites introuvables." });
    res.status(200).json(activites);
  } catch {
    res.status(500).json({ erreur: "Erreur interne du serveur." });
  }
});

//POST /activities Privé à son auteur -- enregistre les activités pratiqués
routerActivites.post(
  "/",
  authentifier,
  async (req: Request, res: Response) => {
    try {
      const { entreeJournalId, activiteId } = req.body;
      if (!entreeJournalId || !activiteId) {
        return res.status(400).json({
          message:
            "Erreur: L'ID de l'activité ou l'ID de l'entrée n'est pas dans la requête",
        });
      }

      const liaisonActivite = await prisma.activiteJournal.create({
        data: {
          entreeJournalId: req.body.entreeJournalId,
          activiteId: activiteId,
        },
      });

      res.status(201).json(liaisonActivite);
    } catch {
      res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
  },
);

export default routerActivites;
