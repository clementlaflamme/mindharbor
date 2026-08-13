import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function authentifier(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization; // Bearer xxx.yyy.zzz
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ erreur: "Token manquant" });

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token!, process.env.JWT_SECRET!);
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ erreur: "Token invalide / expiré" });
  }
}

export function exigerRole(role: String) {
  return (req: Request, res: Response, next: NextFunction) => {
    if ((res as any).user.role !== role) {
      return res.status(403).json({ erreur: "Accès refusé !" });
    }
    next();
  };
}
