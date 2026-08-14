import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
// import { validate as estUuidValide } from "uuid";
import { authentifier } from "../middleware/auth.js";

const routerMessages = Router();




// // Afficher tous les messages de l'utilisateur connecté
routerMessages.get("/:userId", authentifier, async (req: Request, res: Response) => {
    try {
        const idUtilisateur = (req as any).utilisateur.sub;
        const ami = req.params.userId as string;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page -1) * limit;

        const sort = (req.query.sort as string) || "creeLe";
        const order = (req.query.order as string) === "asc" ? "asc" : "desc";

        const filtre = {
            OR: [
                { expediteurId: idUtilisateur, destinataireId: ami },
                { expediteurId: ami, destinataireId: idUtilisateur }
            ]
        };


        const messages = await prisma.message.findMany({
            where: filtre,
            orderBy: { [sort]: order },
            skip,
            take: limit
        });


        const total = await prisma.message.count({ where: filtre });

        return res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            messages
        });
    } catch (e) {
        return res.status(500).json({ erreur: "Erreur serveur" });
    }
})

// // Afficher tous les messages d'une conversation
routerMessages.get("/", authentifier, async (req: Request, res: Response) => {
    try {
        const idUtilisateur = (req as any).utilisateur.sub;
        const messages = await prisma.message.findMany({ 
            where : {
                OR: [
                    {expediteurId: idUtilisateur},
                    {destinataireId : idUtilisateur}
                ]}, 
                orderBy: { 
                    creeLe: "desc"
                }
    });

    const conversationsMap = new Map();

    for (const msg of messages) {
        const ami = msg.expediteurId === idUtilisateur ? msg.destinataireId : msg.expediteurId;
        if (!conversationsMap.has(ami)) {
            conversationsMap.set(ami, {
                idUtilisateur: ami,
                dernierMessage: msg

            }); 
        }
    }

    const conversation = Array.from(conversationsMap.values());
    return res.status(200).json({ conversation });

        
    } catch (e) {
        return res.status(500).json({ erreur: "Erreur serveur" });
    }
})

//envoyer un message
routerMessages.post("/:userId", authentifier, async (req: Request, res: Response) => {
    const idUtilisateur = (req as any).utilisateur.sub;
    const destId = req.params.userId as string;
    
    const { sujet, contenu } = req.body

    if ( !sujet ) return res.status(400).json({erreur: "Un sujet est obligatoire pour envoyer un message"})

    try {
        const destinataire = await prisma.utilisateur.findUnique({
            where: { id : destId }
        });

        if (!destinataire) {
            return res.status(404).json({message: "Utilisateur introuvable"})
        }

        const bloque = await prisma.blocage.findUnique({
            where: {
                bloqueurId_bloqueId: {
                    bloqueurId: destinataire.id,
                    bloqueId: idUtilisateur
                }
            }
        });

        if (bloque) {
            return res.status(404).json({message: "Utilisateur introuvable"})  //apparrait comme un 404 pour ne pas divulguer l'existance du compte lors d'un blocage (vie privee)
        }

        if (destinataire.visibilite == "PRIVE") {
            return res.status(403).json({message: "ce profil n'accepte pas les messages"})
        }

        const message = await prisma.message.create({
            data: { expediteurId: idUtilisateur, destinataireId: destinataire.id, sujet, contenu }
        });
        return res.status(201).json({message: `Message envoyé a ${destinataire.pseudonyme}`})
    } catch (e) {
        return res.status(400).json({erreur: "Erreur lors de la creation du message"})
    }
});

//lire un message
routerMessages.patch("/lire", authentifier, async (req: Request, res: Response) => {
    const idUtilisateur = (req as any).utilisateur.sub;
    const idmessage = req.query.idmessage as string;
    
    try {
        const message = await prisma.message.findUnique({where: {id: idmessage}});
        if (!message) {
            return res.status(404).json({message: "Message introuvable"});
        }

        if (idUtilisateur !== message.destinataireId && idUtilisateur !== message.expediteurId){
            return res.status(403).json({erreur: "Erreur: Ce message est privé"})
        }

        if (idUtilisateur == message.destinataireId){
            const message_lu = await prisma.message.update({
                where: { id: idmessage },
                data: { lu: true }
            })
            return res.status(200).json(message_lu)
        }
        return res.status(200).json(message)
        
    } catch (e) {
        return res.status(500).json({erreur: "Erreur serveur"})
    }
});