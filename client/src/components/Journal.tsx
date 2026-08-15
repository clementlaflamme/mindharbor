import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../api/api";
import "./css/journal.css";

interface EntreeJournal {
  humeur: number;
  energie: number;
  sommeil: number;
  anxiete: number;
  gratitude: string | null;
}

export default function Journal() {
  const [humeur, setHumeur] = useState("");
  const [energie, setEnergie] = useState("");
  const [sommeil, setSommeil] = useState("");
  const [anxiete, setAnxiete] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [dateAffichee, setDateAffichee] = useState(() =>
    formaterDateISO(new Date()),
  );
  const [msgErreur, setMsgErreur] = useState("");
  const [entree, setEntree] = useState<EntreeJournal | null>(null);
  const dateAujourdhui = formaterDateISO(new Date());
  const [estAujourdhui, setEstAujourdhui] = useState(true);

  useEffect(() => {
    setEstAujourdhui(dateAujourdhui === dateAffichee);
  }, [dateAffichee]);

  async function soumettreFormulaire(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsgErreur("");

    const payload: Record<string, any> = {};

    if (humeur) payload.humeur = Number(humeur);
    if (energie) payload.energie = Number(energie);
    if (sommeil) payload.sommeil = Number(sommeil);
    if (anxiete) payload.anxiete = Number(anxiete);
    if (gratitude.trim()) payload.gratitude = gratitude.trim();

    try {
      let reponse;

      if (estRempli) {
        reponse = await api.patch(`/api/v1/journal/${dateAffichee}`, payload);
      } else {
        reponse = await api.post("/api/v1/journal", payload);
      }

      const entreeSauvegardee = reponse.data.entreeJournal ?? reponse.data;
      setEntree(entreeSauvegardee);

      // Rénitialisation du formulaire
      setHumeur("");
      setEnergie("");
      setSommeil("");
      setAnxiete("");
      setGratitude("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const messageBackend =
          error.response?.data?.erreur ||
          error.response?.data?.message ||
          error.response?.data?.msgErreur;
        setMsgErreur(
          messageBackend || "Une erreur est survenue lors de l'enregistrement.",
        );
      } else if (error instanceof Error) {
        setMsgErreur(error.message);
      } else {
        setMsgErreur("Une erreur inattendue est survenue.");
      }
    }
  }

  const estRempli = entree !== null;

  const LABELS_METRIQUES = [
    { cle: "humeur", label: "Humeur" },
    { cle: "energie", label: "Énergie" },
    { cle: "sommeil", label: "Sommeil" },
    { cle: "anxiete", label: "Anxiété" },
  ] as const;

  useEffect(() => {
    const controller = new AbortController();

    async function chargerEntree() {
      setMsgErreur("");

      try {
        const url = dateAffichee
          ? `/api/v1/journal/${dateAffichee}`
          : "/api/v1/journal/";
        const response = await api.get(url, { signal: controller.signal });

        setEntree(response.data.entreeJournal || null);

        if (response.data.dateAffichee) {
          setDateAffichee(response.data.dateAffichee);
        }
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setMsgErreur("Impossible de charger l'entrée du journal.");
        }
      }
    }

    chargerEntree();

    return () => controller.abort();
  }, [dateAffichee]);

  function formaterDateISO(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  function changerJour(decalage: number) {
    setDateAffichee((dateActuelle) => {
      const dateDeBase = dateActuelle
        ? new Date(`${dateActuelle}T00:00:00Z`)
        : new Date();
      if (isNaN(dateDeBase.getTime())) {
        return formaterDateISO(new Date());
      }

      dateDeBase.setUTCDate(dateDeBase.getUTCDate() + decalage);
      return formaterDateISO(dateDeBase);
    });
  }

  function allerJourPrecedent() {
    changerJour(-1);
  }

  function allerJourSuivant() {
    changerJour(1);
  }

  return (
    <div className="container-j">
      <div className="container-formulaire">
        <form onSubmit={(e) => soumettreFormulaire(e)}>
          <div className="element-formulaire">
            <label htmlFor="humeur">Humeur :</label>
            <select
              id="humeur"
              value={humeur}
              onChange={(e) => setHumeur(e.target.value)}
            >
              <option value="" disabled>
                Sélectionner (1-5)
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="element-formulaire">
            <label htmlFor="energie">Énergie :</label>
            <select
              id="energie"
              value={energie}
              onChange={(e) => setEnergie(e.target.value)}
            >
              <option value="" disabled>
                Sélectionner (1-5)
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="element-formulaire">
            <label htmlFor="sommeil">Sommeil :</label>
            <select
              id="sommeil"
              value={sommeil}
              onChange={(e) => setSommeil(e.target.value)}
            >
              <option value="" disabled>
                Sélectionner (1-5)
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="element-formulaire">
            <label htmlFor="anxiete">Anxiété :</label>
            <select
              id="anxiete"
              value={anxiete}
              onChange={(e) => setAnxiete(e.target.value)}
            >
              <option value="" disabled>
                Sélectionner (1-5)
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="element-formulaire">
            <label htmlFor="gratitude">Gratitude :</label>
            <textarea
              id="gratitude"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
            />
          </div>

          <button type="submit" disabled={!estAujourdhui}>
            {estRempli ? "Modifier" : "Envoyer"}
          </button>
        </form>
        {msgErreur && (
          <p style={{ color: "red", fontWeight: "bold" }}>{msgErreur}</p>
        )}
      </div>
      <div className="container-journal">
        <h3>Journal du {dateAffichee}</h3>

        {estRempli ? (
          <div className="affichage-journal">
            {LABELS_METRIQUES.map(({ cle, label }) => (
              <div className="element-affichage" key={cle}>
                <span className="label-affichage">{label} :</span>
                <span className="valeur-affichage">{entree[cle]} / 5</span>
              </div>
            ))}

            <div className="element-affichage element-affichage--gratitude">
              <span className="label-affichage">Gratitude :</span>
              <p className="valeur-affichage valeur-affichage--texte">
                {entree.gratitude || "Aucune note."}
              </p>
            </div>
          </div>
        ) : (
          <p className="message-vide">
            Aucune entrée de journal pour cette date.
          </p>
        )}

        <div className="pagination-journal">
          <button
            type="button"
            className="bouton-action"
            onClick={allerJourPrecedent}
          >
            ◄
          </button>
          <button
            type="button"
            className="bouton-action"
            onClick={allerJourSuivant}
          >
            ►
          </button>
        </div>
      </div>
    </div>
  );
}
