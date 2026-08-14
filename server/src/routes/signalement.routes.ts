import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';
import { authentifier } from '../middlewares/auth.middleware'; // Ajustez le chemin selon votre structure

const router = Router();
const prisma = new PrismaClient();


router.post('/', authentifier, async (req: Request, res: Response) => {
  try {
    const { messageId, publicationId, commentaireId, categorie } = req.body;
    const utilisateurId = String((req as any).utilisateur.sub);

    // Validation de la categorie par rapport à l'Enum Prisma
    const categoriesValides = ['INAPPROPRIE', 'SPAM', 'INQUIETANT'];
    if (!categorie || !categoriesValides.includes(categorie)) {
      return res.status(400).json({ erreur: "Catégorie de signalement invalide. Choisissez parmi: INAPPROPRIE, SPAM ou INQUIETANT." });
    }

    // s'assurer qu'au moins un contenu est cible
    if (!messageId && !publicationId && !commentaireId) {
      return res.status(400).json({ erreur: "Vous devez cibler un messageId, un publicationId ou un commentaireId à signaler." });
    }

    const signalement = await prisma.signalement.create({
      data: {
        utilisateurId,
        messageId: messageId || null,
        publicationId: publicationId || null,
        commentaireId: commentaireId || null,
        categorie,
        statut: 'EN_ATTENTE'
      }
    });

    res.status(201).json({
      message: "Le signalement a bien été enregistré et sera traité par la modération.",
      signalement
    });
  } catch (error) {
    res.status(500).json({ erreur: "Erreur lors de la création du signalement." });
  }
});

export default router;