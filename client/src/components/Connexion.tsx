import { useState } from "react";
import axios from "axios";
import { api } from "../api/api";
import { useAuth } from "../api/context/AuthContext";
import "./css/formulaire.css";

interface Props {
  setPageActive: (page: string) => void;
  rafraichirUtilisateur: () => void;
}

export default function Connexion({
  setPageActive,
  rafraichirUtilisateur,
}: Props) {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [msgErreur, setMsgErreur] = useState("");
  const { seConnecter } = useAuth();

  async function soumettreFormulaire(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsgErreur("");

    try {
      const { data } = await api.post("/api/v1/auth/login", {
        courriel: email,
        motDePasse: mdp,
      });

      seConnecter(data.token);
      rafraichirUtilisateur();
      setPageActive("journal");
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
      <h3>Formulaire de connexion</h3>
      <form
        className="container-form"
        onSubmit={(e) => soumettreFormulaire(e)}
      >
        <div className="element-form">
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="element-form">
          <label>Mot de passe :</label>
          <input
            type="password"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
        {msgErreur && (
          <p style={{ color: "red", fontWeight: "bold" }}>{msgErreur}</p>
        )}
      </form>
    </div>
  );
}
