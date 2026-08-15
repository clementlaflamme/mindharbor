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
    <div className="container-inscription">
      <h2>Écran Inscription</h2>

      <form
        className="container-formulaire"
        onSubmit={(e) => soumettreFormulaire(e)}
      >
        <div>
          <label>Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>
        <div>
          <label>Pseudonyme</label>
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
          />
        </div>
        <button type="submit">Envoyer</button>
        {msgErreur && <p>{msgErreur}</p>}
      </form>
    </div>
  );
}
