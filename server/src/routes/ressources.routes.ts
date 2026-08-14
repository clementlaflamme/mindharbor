import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middleware/auth.js";
import type { CategorieRessource } from "../../generated/prisma/enums.js";

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
router.get ("/:id", async (req: Request, res: Response) => {
    const id = (req.params.id) as string
    const ressource = await prisma.ressource.findUnique({where: {id}})
    if (!ressource) return res.status(404).json({erreur: "Erreur: La ressource est introuvable."})
    res.json(ressource)
})


//POST /resources Administrateur
router.post("/", authentifier, exigerRole("ADMIN"), async (req: Request, res:Response) => {
    const { titre, contenu, url, categorie, type, duree, niveau } = req.body
    if (!titre || !contenu || !url || !categorie || !type || !duree || !niveau ) return res.status(400).json({erreur: "Ajout impossible. Une information est manquante."})
    const ressource = await prisma.ressource.create({data: {titre, contenu, url, categorie, type, duree, niveau}})
    res.status(201).json(ressource)
})

//POST /resources/:id/favorite Authentifié
router.post("/:id/favorite", authentifier, async (req: Request, res: Response) => {
    try {
        const utilisateurId = (req as any).user.sub
        const ressourceId = (req.params.id) as string

        // valider si la ressource existe
        const ressourceExiste = await prisma.ressource.findUnique({where: {id: ressourceId}})
        if (!ressourceExiste) return res.status(404).json({erreur: "Erreur: Ressource inexistante, impossible d'ajouter aux favoris."})

        const favoriId = {
            utilisateurId_ressourceId: {
                utilisateurId,
                ressourceId
            }
        }
        const favori = await prisma.favori.findUnique({where: favoriId})
        if (favori) return res.status(409).json({erreur: "Cette ressource est déjà dans vos favoris!"})
        
        const nouveauFavori = await prisma.favori.create({data: {utilisateurId, ressourceId}})
        res.status(201).json(nouveauFavori)
    } catch {
        res.status(500).json({erreur: "Erreur interne du serveur."})
    }
})


//DELETE /resources/:id/favorite Authentifié
router.delete("/:id/favorite", authentifier, async(req:Request, res: Response) => {
    const utilisateurId = (req as any).user.sub
    const ressourceId = (req.params.id) as string
    const favoriId = {
    utilisateurId_ressourceId: {
        utilisateurId,
        ressourceId,
        },
    };
    const favori = await prisma.favori.findUnique({where: favoriId})
    if (!favori) return res.status(404).json({erreur: "Erreur: Favori introuvable, impossible d'effacer."})
    if (favori.utilisateurId != utilisateurId) return res.status(403).json({erreur: "Erreur: Ce n'est pas votre favori."})
    await prisma.favori.delete({where: favoriId})

    res.status(204).end
})

//GET /me/favorites Authentifié
router.get("/me/fav", authentifier, async (req:Request, res:Response) => {
    const utilisateurId = (req as any).user.sub
    const favoris = await prisma.favori.findMany({where: {utilisateurId}, include: {ressource:true}})
    res.json(favoris)
})

//GET /me/suggestions Authentifié -- suggestion contextuelle: verifie derniere entree du journal si notes >= 4 et suggère une ressource de la catégorie
router.get("/me/suggestions", authentifier, async(req: Request, res: Response) => {
    try {
        const utilisateurId = (req as any).user.sub
        const dernierJournal = await prisma.entreeJournal.findFirst({
            where: {utilisateurId},
            orderBy: {creeLe: "desc"}
        })
        if (!dernierJournal) return res.status(404).json({message: "Erreur: Aucune entrée de journal trouvé. Génération de suggestions impossibles."})

        // On garde une liste des catégories avec une mauvais note (>= 4)    
        const categoriesCibles: CategorieRessource[] = []
        if (dernierJournal.humeur >= 4) categoriesCibles.push("HUMEUR")
        if (dernierJournal.energie >= 4) categoriesCibles.push("ENERGIE")
        if (dernierJournal.sommeil >= 4) categoriesCibles.push("SOMMEIL")
        if (dernierJournal.anxiete >= 4) categoriesCibles.push("ANXIETE")

        // Si les notes du dernier journal sont bonnes pas de suggestion et message de support
        if (categoriesCibles.length === 0) return res.json({message: "Vous êtes sur la bonne voie! :)"})

        // recherche de suggestions à donner, en prendre max 3 et les retournées
        const suggestions = await prisma.ressource.findMany({
            where: {
                categorie: {
                    in: categoriesCibles,
                }
            },
            take: 3,
        })
        return res.json({
            categoriesTroubles: "categoriesCibles",
            derniereEntreeDate: "dernierJournal.creeLe", suggestions
        })
    } catch {
        res.status(500).json({erreur: "Erreur interne du serveur."})
    }
})

export default router