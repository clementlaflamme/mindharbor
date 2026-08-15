import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { GroupsPage } from "./pages/GroupsPage";
import { AdminSignalementsPage } from "./pages/AdminSignalementsPage";

const API = "http://localhost:3000"


function App() {
  const [ongletActif, setOngletActif] = useState<string>('messagerie');

  return (
    <div className="app-container" style={{ backgroundColor: '#e2ecc8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/*
      */}
      <Navbar surChangementOnglet={setOngletActif} ongletActif={ongletActif} />

      <main className="content" style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '24px', margin: '10px 0' }}>Exam mi-session service web</h1>

        {ongletActif === 'groupes' ? (
          <GroupsPage />
        ) : (
          <div className="messagerie-container">
            <h2 style={{ textAlign: 'center', fontSize: '20px' }}>Messagerie</h2>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;

