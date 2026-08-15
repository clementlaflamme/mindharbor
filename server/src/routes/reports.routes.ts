import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middleware/auth.js";
import { z } from "zod";

const routerReports = Router();

const bodySignalement = z
  .object({
    messageId: z.string().optional(),
    categorie: z.enum(["INAPPROPRIE", "SPAM", "INQUIETANT"]),
    publicationId: z.string().optional(),
    commentaireId: z.string().optional(),
  })
  .strict();

routerReports.post("/", authentifier, async (req: Request, res: Response) => {
  try {
    const verifierBody = bodySignalement.safeParse(req.body);
    if (!verifierBody.success) {
      return res.status(400).json({
        message: "Les données fournies sont invalides",
      });
    }

    const signalement = await prisma.signalement.create({
      data: { utilisateurId: (req as any).utilisateur.sub, ...req.body },
    });

    return res.status(201).json({ signalement });
  } catch (error) {
    console.error("Erreur :", error);
    return res
      .status(400)
      .json({ message: "Erreur lors de la création du signalement." });
  }
});

export default routerReports;
