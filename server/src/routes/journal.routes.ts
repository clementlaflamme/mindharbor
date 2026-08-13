import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier } from "../middleware/auth.js";

const routerJournal = Router();

routerJournal.get("/", authentifier, async (req: Request, res: Response) => {
  try {
    // Gérer l'accès : seul l'auteur peut voir son journal
    const utilisateurId = (req as any).user.sub;

    // Query parameters
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const order = (req.query.order as string) === "asc" ? "asc" : "desc";

    const champsTriables = [
      "creeLe",
      "majLe",
      "humeur",
      "energie",
      "sommeil",
      "anxiete",
      "gratitude",
    ];

    const sort = champsTriables.includes(req.query.sort as string)
      ? (req.query.sort as string)
      : "creeLe";

    const [entreesJournal, total] = await Promise.all([
      prisma.entreeJournal.findMany({
        where: { utilisateurId },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.entreeJournal.count({ where: { utilisateurId } }),
    ]);

    res.status(200).json({
      entreesJournal,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

    res.status(200).json({ entreesJournal });
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la récupération des entrées du journal",
    });
  }
});

routerJournal.post("/", authentifier, async (req: Request, res: Response) => {
  try {
    
    const entreeJournal = await prisma.entreeJournal.create({
      data: {
        ...req.body,
        utilisateurId: (req as any).user.sub
      },
    });

    res.status(200).json({ entreeJournal });
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de l'envoi de l'entrée du journal",
    });
  }
});

export default routerJournal;
