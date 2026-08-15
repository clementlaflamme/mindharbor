import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';
import { authentifier } from '../middlewares/auth.middleware';
const router = Router();
const prisma = new PrismaClient();


router.get('/', authentifier, async (req: Request, res: Response) => {
  try {
    const { recherche } = req.query;

    const groupes = await prisma.group.findMany({
      where: recherche ? {
        OR: [
          { thematique: { contains: recherche as string, mode: 'insensitive' } },
          { description: { contains: recherche as string, mode: 'insensitive' } }
        ]
      } : {},
      include: {
        _count: { select: { membres: true } }
      }
    });

    res.json(groupes);
  } catch (error) {
    res.status(500).json({ erreur: "Erreur lors de la recherche des groupes." });
  }
});

// 2. CRÉER UN GROUPE (POST /)
router.post('/', authentifier, async (req: Request, res: Response) => {
  try {
    const { thematique, description, regles, visibilite } = req.body;
    const utilisateurId = String((req as any).utilisateur.sub);

    if (!thematique || !description || !regles) {
      return res.status(400).json({ erreur: "Champs obligatoires manquants." });
    }

    const nouveauGroupe = await prisma.group.create({
      data: {
        thematique,
        description,
        regles,
        visibilite: visibilite || 'PUBLIC',
        membres: {
          create: [
            { utilisateurId, role: 'MODERATEUR' }
          ]
        }
      }
    });

    res.status(201).json(nouveauGroupe);
  } catch (error) {
    res.status(500).json({ erreur: "Erreur lors de la création du groupe." });
  }
});

router.post('/:groupId/rejoindre', authentifier, async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const utilisateurId = String((req as any).utilisateur.sub); // Récupère l'ID depuis le JWT
    const { presentation } = req.body;

    // Vérifier si le groupe existe
    const groupe = await prisma.group.findUnique({ where: { id: groupId } });
    if (!groupe) {
      return res.status(404).json({ erreur: "Groupe introuvable." });
    }

    // Si le groupe est public, on l'ajoute directement comme membre
    if (groupe.visibilite === 'PUBLIC') {
      const membre = await prisma.membreGroup.create({
        data: { groupId, utilisateurId, role: 'MEMBRE' }
      });
      return res.status(201).json({ message: "Rejoint avec succès.", membre });
    }

    // Si le groupe est prive, on exige une courte présentation
    if (!presentation || presentation.trim() === "") {
      return res.status(400).json({ erreur: "Une courte présentation est requise pour les groupes privés." });
    }

    const demande = await prisma.demandeAdhesion.create({
      data: {
        groupId,
        utilisateurId,
        presentation,
        statut: 'EN_ATTENTE'
      }
    });

    res.status(201).json({ message: "Demande d'adhésion envoyée avec succès.", demande });
  } catch (error) {
    res.status(500).json({ erreur: "Erreur lors de la demande d'adhésion." });
  }
});


router.put('/demandes/:demandeId', authentifier, async (req: Request, res: Response) => {
  try {
    const { demandeId } = req.params;
    const { statut } = req.body; // 'Accepter' ou 'refuser'
    const moderateurId = String((req as any).utilisateur.sub);

    if (!['ACCEPTEE', 'REFUSEE'].includes(statut)) {
      return res.status(400).json({ erreur: "Statut invalide." });
    }

    // Recuperer la demande pour connaître le groupe
    const demande = await prisma.demandeAdhesion.findUnique({ where: { id: demandeId } });
    if (!demande) {
      return res.status(404).json({ erreur: "Demande d'adhésion introuvable." });
    }

    // Sécurité : Vérifier que l'utilisateur connecte est bien moderateur de ce groupe
    const estModo = await prisma.membreGroup.findFirst({
      where: {
        groupId: demande.groupId,
        utilisateurId: moderateurId,
        role: 'MODERATEUR'
      }
    });

    if (!estModo) {
      return res.status(403).json({ erreur: "Accès refusé. Vous devez être modérateur de ce groupe." });
    }

    // Mettre à jour la demande d'adhesion
    const demandeMiseAJour = await prisma.demandeAdhesion.update({
      where: { id: demandeId },
      data: { statut: statut === 'ACCEPTEE' ? 'ACCEPTEE' : 'REFUSEE' }
    });

    // Si adhesion est acceptée, on enregistre officiellement le membre
    if (statut === 'ACCEPTEE') {
      await prisma.membreGroup.create({
        data: {
          groupId: demande.groupId,
          utilisateurId: demande.utilisateurId,
          role: 'MEMBRE'
        }
      });
    }

    res.json({ message: `Demande traitée avec succès : ${statut}`, demande: demandeMiseAJour });
  } catch (error) {
    res.status(500).json({ erreur: "Erreur lors du traitement de la demande." });
  }
});


router.get('/:groupId/publications', authentifier, async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const utilisateurId = String((req as any).utilisateur.sub);
    const page = parseInt(req.query.page as string) || 1;
    const limite = parseInt(req.query.limite as string) || 10;

    const groupe = await prisma.group.findUnique({ where: { id: groupId } });
    if (!groupe) return res.status(404).json({ erreur: "Groupe introuvable." });

    // Sécurité : Si le groupe est prive, l'utilisateur doit etre membre
    if (groupe.visibilite === 'PRIVE') {
      const estMembre = await prisma.membreGroup.findUnique({
        where: { groupId_utilisateurId: { groupId, utilisateurId } }
      });
      if (!estMembre) {
        return res.status(403).json({ erreur: "Accès refusé. Vous devez être membre de ce groupe privé." });
      }
    }

    // Recuperation paginee
    const publications = await prisma.publication.findMany({
      where: { groupId },
      skip: (page - 1) * limite,
      take: limite,
      orderBy: { creeLe: 'desc' },
      include: {
        utilisateur: { select: { pseudonyme: true, avatarUrl: true } },
        commentaires: {
          include: { auteur: { select: { pseudonyme: true } } }
        }
      }
    });

    res.json({ page, limite, publications });
  } catch (error) {
    res.status(500).json({ erreur: "Erreur lors de la récupération des publications." });
  }
});

// Cree une publication dans le groupe

router.post('/:groupId/publications', authentifier, async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { contenu } = req.body;
    const utilisateurId = String((req as any).utilisateur.sub);

    // Verifier si l'utilisateur est membre du groupe
    const estMembre = await prisma.membreGroup.findUnique({
      where: { groupId_utilisateurId: { groupId, utilisateurId } }
    });
    if (!estMembre) {
      return res.status(403).json({ erreur: "Accès refusé. Vous devez être membre pour publier." });
    }

    if (!contenu || contenu.trim() === "") {
      return res.status(400).json({ erreur: "Le contenu de la publication ne peut pas être vide." });
    }

    const publication = await prisma.publication.create({
      data: { groupId, utilisateurId, contenu }
    });
    res.status(201).json(publication);
  } catch (error) {
    res.status(500).json({ erreur: "Erreur lors de la création de la publication." });
  }
});

// Commenter une publication

router.post('/publications/:publicationId/commentaires', authentifier, async (req: Request, res: Response) => {
  try {
    const { publicationId } = req.params;
    const { contenu } = req.body;
    const utilisateurId = String((req as any).utilisateur.sub);

    // Verifier si la publication existe
    const publication = await prisma.publication.findUnique({ where: { id: publicationId } });
    if (!publication) {
      return res.status(404).json({ erreur: "Publication introuvable." });
    }

    // Verifier si l'utilisateur est membre du groupe associe a cette publication
    const estMembre = await prisma.membreGroup.findUnique({
      where: {
        groupId_utilisateurId: {
          groupId: publication.groupId,
          utilisateurId
        }
      }
    });
    if (!estMembre) {
      return res.status(403).json({ erreur: "Accès refusé. Vous devez être membre du groupe pour commenter." });
    }

    if (!contenu || contenu.trim() === "") {
      return res.status(400).json({ erreur: "Le commentaire ne peut pas être vide." });
    }

    const commentaire = await prisma.commentaireGroup.create({
      data: { publicationId, utilisateurId, contenu }
    });
    res.status(201).json(commentaire);
  } catch (error) {
    res.status(500).json({ erreur: "Erreur lors de l'ajout du commentaire." });
  }
});


export default router;
