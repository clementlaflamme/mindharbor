import { useAuth } from "../api/context/AuthContext";
import { useState } from "react";
import "./css/navbar.css";

interface NavbarProps {
  setPageActive: (page: string) => void;
  rafraichirUtilisateur: () => void;
  nonLus: number;
}

export default function Navbar({
  nonLus,
  setPageActive,
  rafraichirUtilisateur,
}: NavbarProps) {
  // informations de connexion récupérées du useAuth
  const { estConnecte, estAdmin, seDeconnecter } = useAuth();
  const [popupConnexion, setPopupConnexion] = useState(false);
  

  // handler de la déconnexion
  const gererDeconnexion = () => {
    seDeconnecter();
    localStorage.removeItem("token");
    setPageActive("ressources");
    rafraichirUtilisateur();
  };

  function naviguerOuAvertir(page: string) {
    if (!estConnecte) {
      setPopupConnexion(true);
      return;
    }
    setPageActive(page);
  }

  function allerVersConnexion() {
    setPopupConnexion(false);
    setPageActive("connexion");
  }

  return (<>
  {popupConnexion && (
        <div className="popup-overlay">
          <div className="popup-contenu">
            <h3>Connexion requise</h3>
            <p>Vous devez vous connecter pour accéder à cette section.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "1rem" }}>
              <button className="bouton-action" onClick={allerVersConnexion}>
                Se connecter
              </button>
              <button 
                className="bouton-action" 
                style={{ backgroundColor: "#94a3b8" }} 
                onClick={() => setPopupConnexion(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    <nav
      className="navbar"
      style={{
        display: "flex",
        borderBottom: "4px solid var(--couleur-palette1)",
      }}
    >
      <div
        className="navbar-logo"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "20px",
        }}
      >
        <img
          onClick={() => setPageActive("ressources")}
          style={{ maxWidth: "100px", height: "auto" }}
          src="../../ressources/images/MindHarborLogo.png"
          alt="Logo"
        />
      </div>

      <div
        className="navbar-right"
        style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <div
          className="navbar-comptes"
          style={{ display: "flex", margin: "4px", justifyContent: "flex-end" }}
        >
          {/* affichage si connecté */}
          {estConnecte ? (
            <button
              onClick={gererDeconnexion}
              className="btn-nav-connexion nav-compte"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <button
                onClick={() => setPageActive("inscription")}
                className="btn-nav-inscription nav-compte"
              >
                Inscription
              </button>
              <button
                onClick={() => setPageActive("connexion")}
                style={{ marginLeft: "8px" }}
                className="btn-nav-connexion nav-compte"
              >
                Connexion
              </button>
            </>
          )}
        </div>
        {/* affichage si admin */}
        {estAdmin ? (
          <div
            className="navbar-admin"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "4px",
            }}
          >
            <button
              onClick={() => setPageActive("admin")}
              className="btn-nav-admin nav-compte"
            >
              Administrer
            </button>
          </div>
        ) : null}

        <ul
        className="navbar-links"
        style={{ marginTop: "12px", marginBottom: "12px" }}
      >
        <li>
          <button
            type="button"
            onClick={() => naviguerOuAvertir("journal")}
            className="btn-nav-inscription"
            title="Journal"
          >
            <i className="fa-solid fa-book fa-2x"></i>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => naviguerOuAvertir("analyses")}
            className="btn-nav-stats"
            title="Analyses"
          >
            <i className="fa-solid fa-chart-pie fa-2x"></i>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => naviguerOuAvertir("messagerie")}
            className="btn-nav-messagerie"
            title="Messagerie"
          >
            <i className="fa-solid fa-message fa-2x"></i><span className="non-lus">{nonLus || ""}</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => naviguerOuAvertir("groupes")}
            className="btn-nav-groupes"
            title="Groupes"
          >
            <i className="fa-solid fa-people-group fa-2x"></i>
          </button>
        </li>

        {/* Page Ressources : toujours accessible sans connexion */}
        <li>
          <button
            type="button"
            onClick={() => setPageActive("ressources")}
            className="btn-nav-ressources"
            title="Ressources"
          >
            <i className="fa-solid fa-suitcase-medical fa-2x"></i>
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={() => naviguerOuAvertir("options")}
            className="btn-nav-options"
            title="Options"
          >
            <i className="fa-solid fa-gear fa-2x"></i>
          </button>
        </li>
      </ul>
      </div>
    </nav>
    </>
  );
}
