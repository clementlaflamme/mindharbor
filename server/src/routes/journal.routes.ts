import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier } from "../middleware/auth.js";
import { z } from "zod";
import { id } from "zod/locales";

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

const envoyerEntree = z.object({
  humeur: z.int().min(1).max(5),
  energie: z.int().min(1).max(5),
  sommeil: z.int().min(1).max(5),
  anxiete: z.int().min(1).max(5),
  gratitude: z.string().nonempty().optional(),
});

routerJournal.post("/", authentifier, async (req: Request, res: Response) => {
  try {
    const validationBody = envoyerEntree.safeParse(req.body);
    if (!validationBody) {
      return res
        .status(400)
        .json({ message: "Erreur: Informations incorrectes" });
    }

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
  "/stats",
  authentifier,
  async (req: Request, res: Response) => {
    const idUtilisateur = (req as any).utilisateur.sub;
    try {
      const range = (req.query.range as string) || "30d";

      // Enlever le "d" du nombre de jours
      const days = parseInt(range.replace("d", "")) || 30;

      // Calculer la date du début
      const dateDebut = new Date();
      dateDebut.setDate(dateDebut.getDate() - days);

      const moyennes = await prisma.entreeJournal.aggregate({
        where: {
          utilisateurId: (req as any).utilisateur.sub,
          creeLe: {
            gte: dateDebut,
          },
        },
        _avg: {
          humeur: true,
          energie: true,
          sommeil: true,
          anxiete: true,
        },
      });

      const evolution = await prisma.entreeJournal.findMany({
        where : {
          utilisateurId: idUtilisateur,
          creeLe: { gte: dateDebut }
        },
        orderBy: { creeLe: "asc" }
      })

      const statistiques = evolution.map(entree => ({
        date: entree.creeLe.toISOString().slice(0, 10),
        humeur: entree.humeur,
        energie: entree.energie,
        sommeil: entree.sommeil,
        anxiete: entree.anxiete
      }));


      const stats = {moyennes, evolution: statistiques, dateDebut }

      res.status(200).json(stats);
    } catch (error) {
      console.log("Error :", error);
      res
        .status(400)
        .json("Erreur lors de la récupération des entrées du journal");
    }
  },
);

routerJournal.get(
  "/insights",
  authentifier,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).utilisateur.sub;

      const toutesLesEntrees = await prisma.entreeJournal.findMany({
        where: { utilisateurId: userId },
        include: {
          activites: {
            include: { activite: true },
          },
        },
      });

      const SEUIL_MINIMUM = 3;
      const metriques = ["humeur", "energie", "sommeil", "anxiete"] as const;

      const moyenneGlobale = (metrique: (typeof metriques)[number]) => {
        const total = toutesLesEntrees.reduce((acc, e) => acc + e[metrique], 0);
        return total / toutesLesEntrees.length;
      };

      const activitesMap = new Map<
        string,
        { nom: string; entrees: typeof toutesLesEntrees }
      >();

      for (const entree of toutesLesEntrees) {
        for (const aj of entree.activites) {
          const id = aj.activite.id;
          if (!activitesMap.has(id)) {
            activitesMap.set(id, { nom: aj.activite.nom, entrees: [] });
          }
          activitesMap.get(id)!.entrees.push(entree);
        }
      }

      const correlations = Array.from(activitesMap.entries())
        .map(([activiteId, { nom, entrees: entreesAvecActivite }]) => {
          const total = entreesAvecActivite.length;
          if (total < SEUIL_MINIMUM) return null;

          const entreesSansActivite = toutesLesEntrees.filter(
            (e) => !e.activites.some((aj) => aj.activite.id === activiteId),
          );

          const resultats: Record<string, any> = {};

          for (const metrique of metriques) {
            const moyenneAvec =
              entreesAvecActivite.reduce((acc, e) => acc + e[metrique], 0) /
              total;

            const moyenneSans =
              entreesSansActivite.length > 0
                ? entreesSansActivite.reduce((acc, e) => acc + e[metrique], 0) /
                  entreesSansActivite.length
                : moyenneGlobale(metrique);

            const differenceAbsolue = moyenneAvec - moyenneSans;
            const differencePourcentage =
              moyenneSans !== 0 ? (differenceAbsolue / moyenneSans) * 100 : 0;

            resultats[metrique] = {
              moyenneAvec: Number(moyenneAvec.toFixed(2)),
              moyenneSans: Number(moyenneSans.toFixed(2)),
              differencePourcentage: Number(differencePourcentage.toFixed(1)),
            };
          }

          const metriqueDominante = metriques.reduce((max, m) =>
            Math.abs(resultats[m].differencePourcentage) >
            Math.abs(resultats[max].differencePourcentage)
              ? m
              : max,
          );

          const ecart = resultats[metriqueDominante].differencePourcentage;
          const direction = ecart > 0 ? "plus élevé" : "moins élevé";
          const texte = `Lorsque vous pratiquez «${nom}», votre ${metriqueDominante} est ${Math.abs(
            ecart,
          ).toFixed(0)}% ${direction} que d'habitude.`;

          return {
            activiteId,
            nom,
            nombreOccurrences: total,
            metriques: resultats,
            insight: texte,
          };
        })
        .filter(Boolean)
        .sort((a, b) => {
          const maxA = Math.max(
            ...metriques.map((m) =>
              Math.abs(a!.metriques[m].differencePourcentage),
            ),
          );
          const maxB = Math.max(
            ...metriques.map((m) =>
              Math.abs(b!.metriques[m].differencePourcentage),
            ),
          );
          return maxB - maxA;
        });

      res.status(200).json({ correlations });
    } catch (error) {
      console.error("Erreur :", error);
      res
        .status(500)
        .json({ message: "Erreur lors du calcul des corrélations" });
    }
  },
);

routerJournal.get(
  "/:date",
  authentifier,
  async (req: Request, res: Response) => {
    try {
      const date = req.params.date as string;
      const validerDate = z.iso.date().safeParse(date);
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

      res
        .status(200)
        .json({ entreeJournal: entreeJournal ?? null, dateAffichee: date });
    } catch (error) {
      console.log("Error :", error);
      res
        .status(400)
        .json("Erreur lors de la récupération des entrées du journal");
    }
  },
);

const modifierEntreeSchema = z
  .object({
    humeur: z.number().int().min(1).max(5).optional(),
    energie: z.number().int().min(1).max(5).optional(),
    sommeil: z.number().min(1).max(5).optional(),
    anxiete: z.number().int().min(1).max(5).optional(),
    gratitude: z.string().max(500).nullable().optional(),
  })
  .strict();

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
        return res.status(403).json({
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
