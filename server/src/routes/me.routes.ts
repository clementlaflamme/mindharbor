import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier } from "../middleware/auth.js";
import { id, is } from "zod/locales";
import { NiveauContact, VisibiliteProfil } from "../../generated/prisma/enums.js";

const routerMe = Router();

routerMe.patch("/", authentifier, async (req: Request, res: Response) => {
    const idUtilisateur = (req as any).utilisateur.sub;

    const { nom, avatarUrl, bio } = req.body;

    try {
        const user = await prisma.utilisateur.update({ 
            where: {
                id: idUtilisateur
            },
             data: {
                ...(nom && { nom }),
                ...(avatarUrl && { avatarUrl }),
                ...(bio && { bio })
             },
             select: {
                nom: true,
                avatarUrl: true,
                bio: true
             }
    });
    return res.status(200).json(user)

    } catch (e) {
        return res.status(500).json({erreur: "Erreur serveur"})
    }
});

routerMe.patch("/privacy", authentifier, async (req: Request, res: Response) => {
    const idUtilisateur = (req as any).utilisateur.sub;

    const { visibilite, niveauContact } = req.body;

    if (visibilite && !Object.values(VisibiliteProfil).includes(visibilite)) {
        return res.status(400).json({ erreur: "Visibilité invalide." });
    }

    if (niveauContact && !Object.values(NiveauContact).includes(niveauContact)) {
        return res.status(400).json({ erreur: "Niveau de contact invalide." });
    }

    try {
        const user = await prisma.utilisateur.update({ 
            where: {
                id: idUtilisateur
            },
             data: {
                ...(visibilite && { visibilite }),
                ...(niveauContact && { niveauContact }),
             },
             select: {
                nom: true,
                pseudonyme: true,
                visibilite: true,
                niveauContact: true
             }
    });
    return res.status(200).json(user)

    } catch (e) {
        return res.status(500).json({erreur: "Erreur serveur"})
    }
});