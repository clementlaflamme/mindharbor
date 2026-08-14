import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middleware/auth.js";

const router = Router()

//GET /resources (recherche, filtres, pagination) Public -- resources?recherche=titre&dureeMax=6&page=1&limit=10
router.get("/", async(req: Request, res:Response) => {
    try {
        const {recherche, dureeMax} = req.query

        const page = Math.max(1, Number(req.query.page) || 1)
        const limit = Math.min(50, Number(req.query.limit) || 10)

        const where: any = {}

        // recherche par titre partiel et insensible à la casse
        if (recherche) {
            where.titre = {
                contains: String(recherche),
                mode: "insensitive"
            };
        }

        //filtre par durée
        if (dureeMax) {
            where.duree = {lte: Number(dureeMax)}
        }

        const [ressources, total] = await Promise.all([
            prisma.ressource.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {titre: "asc"},
            }),
            prisma.ressource.count({where}),
        ])
        const totalPages = Math.ceil(total/limit);
        res.json({page, limit, total, totalPages, ressources})
    } catch {
        res.status(500).json({erreur: "Erreur interne du serveur."})
    }
} )


//GET /resources/:id Public

//POST /resources Administrateur
router.post("/", authentifier, exigerRole("ADMIN"), async (req: Request, res:Response) => {
    const { titre, contenu, url, categorie, type, duree, niveau } = req.body
    if (!titre || !contenu || !url || !categorie || !type || !duree || !niveau ) return res.status(400).json({erreur: "Ajout impossible. Une information est manquante."})
    const ressource = await prisma.ressource.create({data: {titre, contenu, url, categorie, type, duree, niveau}})
    res.status(201).json(ressource)
})

//POST /resources/:id/favorite Authentifié

//DELETE /resources/:id/favorite Authentifié

//GET /me/favorites Authentifié

//GET /me/suggestions Authentifié

export default router