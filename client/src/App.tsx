import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { GroupsPage } from "./pages/GroupsPage";
import { AdminSignalementsPage } from "./pages/AdminSignalementsPage";

const API = "http://localhost:3000"

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <main className="content">
        <GroupsPage />
      </main>

      <Footer />
    </div>
  );
}

export default App;
