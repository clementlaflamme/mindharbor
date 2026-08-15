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

  const [pageActive, setPageActive] = useState("analyses");

  return (
    <div className="app-container" style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>

      <Navbar setPageActive={setPageActive} />

      {/* Pour changer d'écran, on devra changer la balise accueil par une autre selon la page désirée
      ex: <Journal/> pour l'écran Journal qui vient de Journal.tsx */}
      <main style={{flexGrow: 1}}>
        <h2>Exam mi-session service web</h2>
        {pageActive === "analyses" && <Analyses/>}
        {pageActive === "ressources" && <Ressources/>}
        {pageActive === "accueil" && <Accueil/>}
        {pageActive === "admin" && <Admin/>}
        {pageActive === "connexion" && <Connexion setPageActive={setPageActive}/>}
        {pageActive === "dashboard" && <Dashboard/>}
        {pageActive === "groupes" && <Groupes/>}
        {pageActive === "inscription" && <Inscription setPageActive={setPageActive}/>}
        {pageActive === "journal" && <Journal/>}
        {pageActive === "messagerie" && <Messagerie/>}
        {pageActive === "options" && <Options/>}
        {pageActive === "optionsBio" && <OptionsBio/>}
      </main>

      <Footer/>

    </div>

  );
}

export default App;
