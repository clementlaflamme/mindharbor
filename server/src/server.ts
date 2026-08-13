import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routerJournal from "./routes/journal.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/v1/journal", routerJournal);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Serveur fonctionnel !" });
});

app.use("/auth", authRoutes)

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Serveur actif sur http://localhost:${PORT}`);
});
