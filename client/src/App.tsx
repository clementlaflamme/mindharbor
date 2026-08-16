import { useEffect, useState } from "react";
import { api } from "./api/api";
import "./index.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Accueil from "./components/Accueil";
import Admin from "./components/Admin";
import Analyses from "./components/Analyses";
import Connexion from "./components/Connexion";
import Dashboard from "./components/Dashboard";
import Groupes from "./components/Groupes";
import Inscription from "./components/Inscription";
import Journal from "./components/Journal";
import Messagerie from "./components/Messagerie";
import Options from "./components/Options";
import Ressources from "./components/Ressources";
import { setOnTokenExpire } from "./api/api";
import { useAuth } from "./api/context/AuthContext";

function App() {
  interface Utilisateur {
    pseudonyme: string;
  }

  const [pageActive, setPageActive] = useState("ressources");
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [sessionExpiree, setSessionExpiree] = useState(false);
  const {seDeconnecter} = useAuth();

  function rafraichirUtilisateur() {
    const token = localStorage.getItem("token");
    if (!token) {
      setUtilisateur(null);
      return;
    }

    api
      .get<Utilisateur>("/api/v1/auth/me")
      .then((res) => setUtilisateur(res.data))
      .catch(() => setUtilisateur(null));
  }

  useEffect(() => {
    rafraichirUtilisateur();
     setOnTokenExpire(() => {
      setUtilisateur(null);
      setSessionExpiree(true);
      seDeconnecter();      
    });
  }, []);

  useEffect(() => {
  if (pageActive !== "connexion" && pageActive !== "inscription" && pageActive !== "ressources") {
    rafraichirUtilisateur();
  }
}, [pageActive]);

function fermerPopupEtRediriger() {
    setSessionExpiree(false);
    setPageActive("connexion");
  }

  return (
    <>
      {sessionExpiree && (
        <div className="popup-overlay">
          <div className="popup-contenu">
            <h3>Session expirée</h3>
            <p>Votre session a expiré. Veuillez vous reconnecter.</p>
            <button
              className="bouton-action"
              onClick={() => fermerPopupEtRediriger()}
            >
              Se reconnecter
            </button>
          </div>
        </div>
      )}
      <div
        className="app-container"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          flex: "1 0 auto",
        }}
      >
        <Navbar
          setPageActive={setPageActive}
          rafraichirUtilisateur={rafraichirUtilisateur}
        />

        {/* Pour changer d'écran, on devra changer la balise accueil par une autre selon la page désirée
      ex: <Journal/> pour l'écran Journal qui vient de Journal.tsx */}
      <main style={{flexGrow: 1}}>
        <h2>
          {utilisateur ? `Bienvenue, ${utilisateur.pseudonyme}` : "Exam mi-session service web"}
        </h2>
        {pageActive === "ressources" && <Ressources/>}
        {pageActive === "analyses" && <Analyses/>}
        {pageActive === "accueil" && <Accueil/>}
        {pageActive === "admin" && <Admin/>}
        {pageActive === "connexion" && <Connexion setPageActive={setPageActive} rafraichirUtilisateur={rafraichirUtilisateur}/>}
        {pageActive === "dashboard" && <Dashboard/>}
        {pageActive === "groupes" && <Groupes/>}
        {pageActive === "inscription" && <Inscription setPageActive={setPageActive}/>}
        {pageActive === "journal" && <Journal/>}
        {pageActive === "messagerie" && <Messagerie/>}
        {pageActive === "options" && <Options/>}
      </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
