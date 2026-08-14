import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routerJournal from "./routes/journal.routes.js";
import authRoutes from "./routes/auth.routes.js";
import ressourcesRoutes from "./routes/ressources.routes.js"
import routerActivites from "./routes/activites.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));



app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Serveur fonctionnel !" });
});

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/journal", routerJournal);
app.use("/resources", ressourcesRoutes)
app.use("/api/v1/activities", routerActivites);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Serveur actif sur http://localhost:${PORT}`);
});
