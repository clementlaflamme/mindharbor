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

routerAdmin.patch(
  "/reports/:id",
  authentifier,
  exigerRole("ADMIN"),
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      if (!id || id.trim() === "") {
        return res
          .status(400)
          .json({ message: "Erreur: Aucun ID de signalement n'a été saisi" });
      }

      const verificationBody = bodySignalement.safeParse(req.body);

      if (!verificationBody.success) {
        return res.status(200).json({
          message: "Données incorrectes",
        });
      }

      const signalementMAJ = await prisma.signalement.update({
        where: { id },
        data: { ...req.body },
      });

      return res.status(200).json({ signalementMAJ });
    } catch (error) {
      console.error("Erreur :", error);
      return res
        .status(400)
        .json({ message: "Erreur lors de la mise à jour du signalement." });
    }
  },
);

export default routerAdmin;
