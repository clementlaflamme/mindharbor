import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middleware/auth.js";
import { z } from "zod";

const routerAdmin = Router();

routerAdmin.get(
  "/reports",
  authentifier,
  exigerRole("ADMIN"),
  async (req: Request, res: Response) => {
    try {
      const signalements = await prisma.signalement.findMany();

      if (!signalements) {
        return res.status(200).json({
          message: "Aucun signalement n'est présent dans la base de données",
        });
      }

      signalements.sort((a, b) => {
        const aEstInquietant = a.categorie === "INQUIETANT" ? 1 : 0;
        const bEstInquietant = b.categorie === "INQUIETANT" ? 1 : 0;
        return bEstInquietant - aEstInquietant;
      });

      return res.status(200).json({ signalements });
    } catch (error) {
      console.error("Erreur :", error);
      return res
        .status(400)
        .json({ message: "Erreur lors de la récupération des signalements." });
    }
  },
);

const bodySignalement = z
  .object({
    utilisateurId: z.string().optional(),
    messageId: z.string().optional(),
    categorie: z.enum(["INAPPROPRIE", "SPAM", "INQUIETANT"]).optional(),
    statut: z.enum(["EN_ATTENTE", "TRAITE", "REJETE"]).optional(),
    publicationId: z.string().optional(),
    commentaireId: z.string().optional(),
  })
  .strict();

routerAdmin.get(
  "/stats",
  authentifier,
  exigerRole("ADMIN"),
  async (req: Request, res: Response) => {
    try {
      const stats = await prisma.entreeJournal.aggregate({
        _avg: {
          humeur: true,
          energie: true,
          sommeil: true,
          anxiete: true,
        },
      });

      return res.status(200).json({ stats });
    } catch (error) {
      console.error("Erreur :", error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des statistiques." });
    }
  },
);

routerAdmin.patch(
  "/users/:id/suspend",
  authentifier,
  exigerRole("ADMIN"),
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!id || id.trim() === "") {
        return res
          .status(400)
          .json({ message: "L'id de l'utilisateur à suspendre est manquant" });
      }

      const utilisateurSuspendu = await prisma.utilisateur.update({
        where: { id },
        data: { estSuspendu: true },
      });

      if (!utilisateurSuspendu) {
        return res
          .status(404)
          .json({ message: "Erreur : aucun utilisateur trouvé" });
      }

      return res.status(200).json({ utilisateurSuspendu });
    } catch (error) {
      console.error("Erreur :", error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la suspension de l'utilisateur." });
    }
  },
);

export default routerAdmin;
