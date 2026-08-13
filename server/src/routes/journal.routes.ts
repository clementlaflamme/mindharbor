import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier } from "../middleware/auth.js";
import { z } from "zod";
import { error } from "node:console";

const routerJournal = Router();

routerJournal.get("/", authentifier, async (req: Request, res: Response) => {
  try {
    // Gérer l'accès : seul l'auteur peut voir son journal
    const utilisateurId = (req as any).utilisateur.sub;

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
      utilisateur: (req as any).utilisateur,
    });
  }
});

routerJournal.post("/", authentifier, async (req: Request, res: Response) => {
  try {
    const entreeJournal = await prisma.entreeJournal.create({
      data: {
        ...req.body,
        utilisateurId: (req as any).utilisateur.sub,
      },
    });

    res.status(201).json({ entreeJournal });
  } catch (error) {
    console.error("Erreur Prisma :", error);
    res.status(400).json({
      message: "Erreur lors de l'envoi de l'entrée du journal",
    });
  }
});

routerJournal.get(
  "/:date",
  authentifier,
  async (req: Request, res: Response) => {
    try {
      const date = req.params.date as string;
      const validerDate = z.iso.date().safeParse(req.params.date);
      if (!validerDate.success) {
        return res.status(400).json({
          message: "La date doit respecter le format ISO AAAA-MM-JJ",
        });
      }

      const debutJournee = new Date(`${date}T00:00:00.000Z`);
      const finJournee = new Date(`${date}T23:59:59.999Z`);

      const entreeJournal = await prisma.entreeJournal.findFirst({
        where: {
          utilisateurId: (req as any).utilisateur.sub,
          creeLe: {
            gte: debutJournee,
            lte: finJournee,
          },
        },
      });

      res.status(200).json(entreeJournal);
    } catch (error) {
      console.log("Error :", error);
      res
        .status(400)
        .json("Erreur lors de la récupération des entrées du journal");
    }
  },
);

const modifierEntreeSchema = z.object({
  humeur: z.number().int().min(1).max(5).optional(),
  energie: z.number().int().min(1).max(5).optional(),
  sommeil: z.number().min(1).max(5).optional(),
  anxiete: z.number().int().min(1).max(5).optional(),
  gratitude: z.string().max(500).optional(),
}).strict();

routerJournal.patch(
  "/:date",
  authentifier,
  async (req: Request, res: Response) => {
    try {
      const date = req.params.date as string;
      const validerDate = z.iso.date().safeParse(req.params.date);
      if (!validerDate.success) {
        return res.status(400).json({
          message: "La date doit respecter le format ISO AAAA-MM-JJ",
        });
      }

      const validationBody = modifierEntreeSchema.safeParse(req.body);

      if (!validationBody.success) {
      return res.status(400).json({
        message: "Les données fournies sont invalides",
      });
    }

      const debutJournee = new Date(`${date}T00:00:00.000Z`);
      const finJournee = new Date(`${date}T23:59:59.999Z`);
      const maintenant = new Date();

      if (debutJournee >= maintenant || maintenant >= finJournee) {
        return res
          .status(403)
          .json({
            message:
              "Vous ne pouvez pas modifier ce journal, car il ne date pas d'aujourd'hui",
          });
      }

      const entreeExistante = await prisma.entreeJournal.findFirst({
        where: {
          utilisateurId: (req as any).utilisateur.sub,
          creeLe: {
            gte: debutJournee,
            lte: finJournee,
          },
        },
      });

      if (!entreeExistante) {
        return res
          .status(404)
          .json({ message: "Aucune entrée trouvée pour cette date." });
      }

      const entreeJournal = await prisma.entreeJournal.update({
        where: {
          id: entreeExistante.id, 
        },
        data: {
          ...req.body,
        },
      });

      res.status(200).json(entreeJournal);
    } catch (error) {
      console.log("Error :", error);
      res
        .status(400)
        .json("Erreur lors de la récupération de l'entrée du journal");
    }
  },
);

export default routerJournal;
