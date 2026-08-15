import { useState } from "react";
import axios from "axios";
import { api } from "../api/api";
import { useAuth } from "../api/context/AuthContext";

interface Props {
  setPageActive: (page: string) => void;
}

export default function Connexion({setPageActive}: Props) {

   const [email, setEmail] = useState("");
    const [mdp, setMdp] = useState("");
    const [msgErreur, setMsgErreur] = useState("");
    const { seConnecter } = useAuth();

    async function soumettreFormulaire(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsgErreur("");

    try {
      const {data} = await api.post("/api/v1/auth/login", {
        courriel: email,
        motDePasse: mdp,
      });

      seConnecter(data.token)
      setPageActive("accueil");
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
    <div className="container-connexion">
        <h2>Écran Connexion</h2>
         <form
        className="container-formulaire"
        onSubmit={(e) => soumettreFormulaire(e)}
      >
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
