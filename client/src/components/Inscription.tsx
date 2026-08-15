import { useState } from "react";
import "./css/formulaire.css";
import { api } from "../api/api";
import axios from "axios";

interface Props {
  setPageActive: (page: string) => void;
}

export default function Inscription({ setPageActive }: Props) {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [nom, setNom] = useState("");
  const [mdp, setMdp] = useState("");
  const [msgErreur, setMsgErreur] = useState("");

  async function soumettreFormulaire(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsgErreur("");

    try {
      await api.post("/api/v1/auth/register", {
        courriel: email,
        pseudonyme: pseudo,
        motDePasse: mdp,
        nom,
      });

      setPageActive("connexion");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Message renvoyé par le backend
        const messageBackend =
          error.response?.data?.erreur || error.response?.data?.message;
        setMsgErreur(
          messageBackend || "Une erreur est survenue lors de la requête.",
        );
      } else if (error instanceof Error) {
        setMsgErreur(error.message);
      } else {
        setMsgErreur("Une erreur inattendue est survenue.");
      }
    }
  }

  return (
    <div className="container-f">
      <h3>Formulaire d'inscription</h3>
      <form
        className="container-formulaire"
        onSubmit={(e) => soumettreFormulaire(e)}
      >
        <div className="element-formulaire">
          <label>Nom :</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div className="element-formulaire">
          <label>Pseudonyme :</label>
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
        </div>
        <div className="element-formulaire">
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="element-formulaire">
          <label>Mot de passe :</label>
          <input
            type="password"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            required
          />
        </div>
        <button type="submit">S'inscrire</button>
        {msgErreur && (
          <p style={{ color: "red", fontWeight: "bold" }}>{msgErreur}</p>
        )}
      </form>
    </div>
  );
}
