import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import { authentifier } from "../middleware/auth.js";

const router = Router();

// POST /auth/register Public
// avec un moyen de créer un Admin avec un code secret admin
router.post("/register", async (req: Request, res: Response) => {
  const { courriel, pseudonyme, motDePasse, nom, avatarUrl, bio, codeAdmin } = req.body;

  if (!courriel || !pseudonyme || !motDePasse) {
    return res
      .status(400)
      .json({
        erreur:
          "Erreur: Une information requise est manquante. (email, pseudo, mot de passe)",
      });
  }
  let attributionRole: "UTILISATEUR" | "ADMIN" = "UTILISATEUR";

  if (codeAdmin && codeAdmin === process.env.CODE_ADMIN) {
    attributionRole = "ADMIN";
  }

  try {
    const hash = await bcrypt.hash(motDePasse, 10);
    const utilisateur = await prisma.utilisateur.create({
      data: { courriel, pseudonyme, motDePasse: hash, role: attributionRole, nom, avatarUrl, bio },
    });
    res
      .status(201)
      .json({
        id: utilisateur.id,
        courriel: utilisateur.courriel,
        pseudonyme: utilisateur.pseudonyme,
        nom: utilisateur.nom,
        avatarUrl: utilisateur.avatarUrl,
        bio: utilisateur.bio,
      });
  } catch {
    res
      .status(400)
      .json({
        erreur: "Erreur: Le email ou le nom d'utilisateur est déjà pris.",
      });
  }
})

// POST /auth/login Public
router.post("/login", async (req: Request, res: Response) => {
  const { courriel, motDePasse } = req.body;
  const utilisateur = await prisma.utilisateur.findUnique({ where: { courriel } });

  // rejeter si le nom d'utilisateur n'est pas bon
  if (!utilisateur)
    return res.status(401).json({ erreur: "Identifiants invalides." });

    // rejeter si le mdp ne correspond pas a la version hachée dans la BD
    const ok = await bcrypt.compare(motDePasse, utilisateur.motDePasse)
    if (!ok) return res.status(401).json({erreur: "Identifiants invalides."})

  // signature du token avec le JWT_SECRET de .env
  const token = jwt.sign(
    { sub: utilisateur.id, role: utilisateur.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );
  res.status(200).json({ token });
});

// POST /auth/refresh Public, jeton valide // À revoir, demande d'info envoyée au prof


// POST /auth/logout Authentifié -- note: on devra faire localStorage.removeItem("token") dans le Frontend
router.post("/logout", authentifier, async (req:Request, res:Response) => {
    return res.status(200).json({message: "Déconnexion réussie."})
})


// GET /auth/me Authentifié
router.get("/me", authentifier, async (req: Request, res: Response) => {
  try {
    const id = (req as any).utilisateur?.sub;

    if (!id) {
      return res
        .status(401)
        .json({ erreur: "Accès refusé. Vous devez d'abord vous connecter." });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id },
      select: {
        id: true,
        courriel: true,
        pseudonyme: true,
        role: true,
        avatarUrl: true,
        bio: true,
      },
    });

    if (!utilisateur) {
      return res.status(404).json({ erreur: "Erreur: Utilisateur introuvable." });
    }

    return res.json(utilisateur);
  } catch (e) {
    return res.status(500).json({ erreur: "Erreur du serveur" });
  }
});

export default router;