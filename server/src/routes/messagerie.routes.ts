import { Router, type Request, type Response } from "express";
import prisma from "../../utils/prisma.js";
// import { validate as estUuidValide } from "uuid";
import { authentifier } from "../middleware/auth.js";

const routerMessagerie = Router();

routerMessagerie.get("/messages"), authentifier, async (req: Request, res: Response) => {
    try {
        if ((req as any).u)
    }
}