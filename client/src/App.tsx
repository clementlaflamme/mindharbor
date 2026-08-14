import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { GroupsPage } from "./pages/GroupsPage";

const API = "http://localhost:3000"

function App() {
    const [activeTab, setActiveTab] = useState<'groups' | 'admin'>('groups');

  return (
    <div className="app-container">
      <Navbar/>
      <div style={{ padding: '10px 24px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setActiveTab('groups')}
                style={{ padding: '8px 16px', backgroundColor: activeTab === 'groups' ? '#4f46e5' : '#475569', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Vue Groupes
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                style={{ padding: '8px 16px', backgroundColor: activeTab === 'admin' ? '#ef4444' : '#475569', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Panneau Admin (Signalements)
              </button>
            </div>

            <main className="content" style={{ minHeight: '80vh' }}>
              {activeTab === 'groups' ? <GroupsPage /> : <AdminSignalementsPage />}
            </main>
      <Footer/>
    </div>

  );
}

export default App;
