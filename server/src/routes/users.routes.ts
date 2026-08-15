import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier } from "../middleware/auth.js";

const routerUsers = Router();

// Afficher un utilisateur
routerUsers.get("/:id", async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string;
        const user = await prisma.utilisateur.findUnique({
            where: {id: userId},
            select: {
                nom: true,
                pseudonyme: true,
                avatarUrl: true,
                bio: true,
                visibilite: true,
            }
        });

        if (user && user.visibilite == "PUBLIC"){
            return res.status(200).json(user)
        } else {
            return res.status(404).json({erreur: "Utilisateur introuvable"})
        }
    } catch (e) {
        return res.status(500).json({ erreur: "Erreur serveur" });
    }
})

// Bloquer un utilisateur
routerUsers.post("/:id/block", authentifier, async (req: Request, res: Response) => {
    const idUtilisateur = (req as any).utilisateur.sub;
    try {
        const userId = req.params.id as string;
        const membre = await prisma.utilisateur.findUnique({
            where: {id: userId}
        });

        if (!membre){
            return res.status(404).json({erreur: "Utilisateur introuvable"})
        }

        const dejaBloque = await prisma.blocage.findUnique({
            where: { bloqueurId_bloqueId: { bloqueurId: idUtilisateur, bloqueId: membre.id }}
        });

        if (dejaBloque) {
            return res.status(200).json({ message: `Utilisateur ${membre.pseudonyme} est déjà bloqué` });
        }

        const bloque = await prisma.blocage.create({
            data: { bloqueurId: idUtilisateur, bloqueId: membre.id}
        });
        return res.status(201).json({message: `Utilisateur ${membre.pseudonyme} bloqué`})

    } catch (e) {
        return res.status(500).json({ erreur: "Erreur serveur" });
    }
})

//recuperer un id par pseudo
routerUsers.get("/pseudo/:pseudo", async (req: Request, res: Response) => {
    try {
        const pseudo = req.params.pseudo as string;
        const user = await prisma.utilisateur.findUnique({
            where: {pseudonyme: pseudo},
            select: {
                id: true,
                niveauContact: true,
            }
        });

        if (user && user.niveauContact != "PERSONNE"){
            return res.status(200).json(user)
        } else {
            return res.status(404).json({erreur: "Utilisateur introuvable"})
        }
    } catch (e) {
        return res.status(500).json({ erreur: "Erreur serveur" });
    }
})
export default routerUsers