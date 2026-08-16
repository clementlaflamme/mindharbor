import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../utils/prisma.js";
dotenv.config();

export type JwtPayload = { sub: number; role: "UTILISATEUR" | "ADMIN" };

// verifie le token JWT et attache l'utilisateur a req.utilisateur
export async function authentifier(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ code: "TOKEN_INVALIDE", message: "Session expirée ou token manquant" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(
      token!,
      process.env.JWT_SECRET!,
    ) as unknown as JwtPayload;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: payload.sub as unknown as string },
      select: {
        id: true,
        role: true,
        estSuspendu: true,
      },
    });

    // Vérifier si l'utilisateur existe toujours
    if (!utilisateur) {
      return res.status(401).json({ erreur: "Utilisateur introuvable." });
    }

    // Refuser l'accès si l'utilisateur est suspendu
    if (utilisateur.estSuspendu) {
      return res.status(403).json({
        erreur:
          "Accès refusé. Votre compte a été suspendu par un administrateur.",
      });
    }
    (req as any).utilisateur = payload;
    next();
  } catch {
    res
      .status(401)
      .json({ erreur: "Accès refusé. Votre token est invalide ou expiré." });
  }
}

// fonction pour exiger un role pour acceder a une route, a brancher apres authentifier
export function exigerRole(role: "UTILISATEUR" | "ADMIN") {
  return (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).utilisateur.role !== role) {
      return res
        .status(403)
        .json({ erreur: "Accès refusé. Vous n'avez pas les droits." });
    }
    next();
  };
}
