import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const API = "http://localhost:3000"

function App() { 

  return (
    <div className="app-container">
      <Navbar/>
      <main className="content">
        <h1>Exam mi-session service web</h1>
        <h2>Contenu</h2>
      </main>
      <Footer/>
    </div>

  );
}

export default App;
