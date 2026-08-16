import "./css/options.css";
import { useState, useEffect } from "react";
import api from "../api/axios";
import avatarDefaut from "../../ressources/images/default_avatar.jpg";
import axios from "axios";

export default function Options() {
  const [visibilite, setVisibilite] = useState("");
  const [niveauContact, setNiveauContact] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [nom, setNom] = useState("");
  const [chargement, setChargement] = useState(true);
  const [msgErreur, setMsgErreur] = useState("");

  async function chargerProfil() {
    try {
      setChargement(true);
      const { data } = await api.get("/api/v1/auth/me");

      if (data.visibilite) setVisibilite(data.visibilite);
      if (data.niveauContact) setNiveauContact(data.niveauContact);
      if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
      if (data.bio) setBio(data.bio);
      if (data.nom) setNom(data.nom);
    } catch (error) {
      setMsgErreur("Impossible de charger les options du profil.");
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    chargerProfil();
  }, []);

  async function soumettreFormulaire(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsgErreur("");

    try {
      const payloadPrivacy: Record<string, any> = {
        visibilite,
        niveauContact,
      };

      const payloadProfil: Record<string, any> = {
        bio,
      };

      if (nom.trim()) payloadProfil.nom = nom.trim();
      if (newAvatarUrl.trim()) {
        payloadProfil.avatarUrl = newAvatarUrl.trim();
        setNewAvatarUrl("");
      }

      await api.patch("/api/v1/me", payloadProfil);
      await api.patch("/api/v1/me/privacy", payloadPrivacy);

      chargerProfil();
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

  if (chargement) {
    return <p>Chargement des options...</p>;
  }

  return (
    <>
      <h2>Vos options de profil:</h2>
      <div className="container-options">
        <form
          className="formulaire-options"
          onSubmit={(e) => soumettreFormulaire(e)}
        >
          <h3>Confidentialité</h3>
          <div className="element-formulaire">
            <label htmlFor="visibilite">Visibilité :</label>
            <select
              id="visibilite"
              value={visibilite}
              onChange={(e) => setVisibilite(e.target.value)}
            >
              <option value="PUBLIC">Public</option>
              <option value="GROUPES_SEULEMENT">Groupes seulement</option>
              <option value="PRIVE">Privé</option>
            </select>
          </div>
          <div className="element-formulaire">
            <label htmlFor="niveau-contact">Qui peut me contacter :</label>
            <select
              id="niveauContact"
              value={niveauContact}
              onChange={(e) => setNiveauContact(e.target.value)}
            >
              <option value="TOUT_LE_MONDE">Tout le monde</option>
              <option value="PERSONNE">Personne</option>
            </select>
          </div>
          <h3>Nom affiché</h3>

          <input
            id="nom-form"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />

          <h3>Avatar</h3>
          <div className="element-formulaire">
            <img
              src={avatarUrl}
              alt="Avatar"
              onError={(e) => {
                e.currentTarget.src = avatarDefaut;
              }}
            />
            <input
              type="text"
              placeholder="URL du nouvel avatar"
              value={newAvatarUrl}
              onChange={(e) => setNewAvatarUrl(e.target.value)}
            />
          </div>
          <h3>Biographie</h3>
          <div>
            <textarea
              className="bio"
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>
          <button id="btn-submit" type="submit">Enregistrer les changements</button>
          {msgErreur && (
            <p style={{ color: "red", fontWeight: "bold" }}>{msgErreur}</p>
          )}
        </form>
      </div>
    </>
  );
}
