import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css"
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
import OptionsBio from "./components/OptionsBio";
import Ressources from "./components/Ressources";


const API = "http://localhost:3000"

function App() { 

  return (
    <div className="app-container">

      <Navbar/>

      {/* Pour changer d'écran, on devra changer la balise accueil par une autre selon la page désirée
      ex: <Journal/> pour l'écran Journal qui vient de Journal.tsx */}
      <main>
        <h1>Exam mi-session service web</h1>
        <Accueil/>
      </main>

      <Footer/>

    </div>

  );
}

export default App;
