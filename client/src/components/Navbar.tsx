import { useState } from "react";
import axios from "axios";
import { api } from "../api/api";
import { useAuth } from "../api/context/AuthContext";

interface NavbarProps {
  setPageActive: (page: string) => void;
  rafraichirUtilisateur: () => void;
}

export default function Navbar({setPageActive, rafraichirUtilisateur}: NavbarProps) {
  // informations de connexion récupérées du useAuth
  const {estConnecte, estAdmin, seDeconnecter} = useAuth();

  // handler de la déconnexion
  const gererDeconnexion = () => {
    seDeconnecter();
    localStorage.removeItem("token");
    setPageActive("accueil");
    rafraichirUtilisateur();
  };


  return (
    <nav className="navbar" style={{display: "flex", borderBottom: "4px solid var(--couleur-palette1)"}}>

      <div className="navbar-logo" style={{display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "20px"}}>
        <img onClick={()=> setPageActive("accueil")} style={{ maxWidth: "100px", height: "auto" }} src="../../ressources/images/MindHarborLogo.png" alt="Logo" />
      </div>

      <div className="navbar-right" style={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
        <div className="navbar-comptes" style={{display: "flex", margin: "4px", justifyContent: "flex-end"}}>
          {/* affichage si connecté */}
          {estConnecte ? (
            <button onClick={gererDeconnexion} className="btn-nav-connexion nav-compte">Déconnexion</button>
          ) : (
            <>
              <button onClick={() => setPageActive("inscription")} className="btn-nav-inscription nav-compte">Inscription</button>
              <button onClick={() => setPageActive("connexion")} style={{marginLeft: "8px"}} className="btn-nav-connexion nav-compte">Connexion</button>
            </>
          )}
        </div>
        {/* affichage si admin */}
        {estAdmin ? (
          <div className="navbar-admin" style={{display: "flex", justifyContent: "flex-end", margin: "4px"}}>
              <button onClick={() => setPageActive("admin")} className="btn-nav-admin nav-compte">Administrer</button>
          </div>

        ) : null}

        <ul className="navbar-links" style={{marginTop: "12px", marginBottom: "12px"}}>
          <li><button onClick={() => setPageActive("journal")} className="btn-nav-inscription"><i className="fa-solid fa-book fa-2x"></i></button></li>
          <li><button onClick={() => setPageActive("ressources")} className="btn-nav-ressources"><i className="fa-solid fa-suitcase-medical fa-2x"></i></button></li>
          <li><button onClick={() => setPageActive("messagerie")} className="btn-nav-messagerie"><i className="fa-solid fa-message fa-2x"></i></button></li>
          <li><button onClick={() => setPageActive("groupes")} className="btn-nav-groupes"><i className="fa-solid fa-people-group fa-2x"></i></button></li>
          <li><button onClick={() => setPageActive("analyses")} className="btn-nav-stats"><i className="fa-solid fa-chart-pie fa-2x"></i></button></li>
          <li><button onClick={() => setPageActive("options")} className="btn-nav-options"><i className="fa-solid fa-gear fa-2x"></i></button></li>
        </ul>
      </div>
    </nav>
  );
}
