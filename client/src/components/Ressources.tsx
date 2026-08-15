import { useState } from "react";
import axios from "axios";
import { api } from "../api/api";
import "./ressources.css";
import { useAuth } from "../api/context/AuthContext";

interface Props {
  setPageActive: (page: string) => void;
}

export default function Ressources({setPageActive}: Props) {

  const {estConnecte} = useAuth(); // necessaire pour afficher la suggestion contextuelle
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState("");
  const [duree, setDuree] = useState("");
  const [niveau, setNiveau] = useState("");
  const [ressSuggeree, setRessSuggeree] = useState("");
  const [listeRessources, setListeRessources] = useState<any[]>([]);

  //useEffect(() => {
    // la liste ListeRessources doit changer quand 
    //un des filtres ou la recherche change
    // clear optionnel (recherche a faire)
  //}, [recherche || duree || niveau || categorie])


  return (
    <div className="container-ressources" style={{display: "flex", flexGrow: 1, flexDirection: "column"}}>
        <div style={{display: "flex"}}>
            <h2 style={{justifyContent: "flex-start", paddingLeft: "32px"}}>Ressources d'aide</h2>
        </div>
        <div className="ress-top" style={{display: "flex", flexGrow: 1, flexDirection: "row", backgroundColor: "green"}}>
            <div className="ress-top-left b-rad25" style={{display: "flex", flexGrow: 1, flexDirection: "column", backgroundColor: "red"}}>
                <form id="rechercheRessource" style={{display: "flex",  gap: "18px"}}> 
                  <input type="search" id="query" name="query" placeholder="Recherche..." style={{flexGrow: 1}}></input>
                  <button>Rechercher</button>
                </form>
                <select name="dropCat " id="dropCat">
                    <option value="anxiete">Anxiete</option>
                </select>
                <select name="dropDuree " id="dropDuree">
                    <option value="court">Court (Moins de 5 minutes)</option>
                </select>
                <select name="dropNiveau " id="dropNiveau">
                    <option value="1">Facile</option>
                </select>
            </div>
            <div className="ress-top-right b-rad25" style={{flexGrow: 1, backgroundColor: "blue"}}>

          <div className="card b-rad25" style={{display: "flex", flexDirection: "column", backgroundColor: "orange"}}>
            <h3 style={{textAlign: "left"}}>Titre</h3>
            <h2 style={{textAlign: "left"}}>Description:</h2>
            <p style={{textAlign: "left"}}>Ceci est une description</p>
            <h4 style={{textAlign: "left"}}>Durée: <span className="duree">14</span></h4>
            <div className="card-fav-split" style={{display: "flex"}}>
              <div className="card-fav-split-left" style={{display: "flex", flexDirection: "column", flexGrow: 1, padding: "12px, 0px"}}>
                <div className="badgeCategorie">Relaxation</div>
                <div className="badgeType">Exercice</div>
              </div>
              <div className="card-fav-split-right" style={{flexGrow: 1}}>
                <button className="btnFavori"><i className="fa-solid fa-heart fa-3x"></i></button>
              </div>
            </div>

          </div>


            </div>
        </div>
        <div className="ress-bot" style={{flexGrow: 2, flexWrap: "wrap", backgroundColor: "yellow"}}>
          <div className="card b-rad25" style={{display: "flex", flexDirection: "column", backgroundColor: "orange"}}>
            <h3 style={{textAlign: "left"}}>Titre</h3>
            <h2 style={{textAlign: "left"}}>Description:</h2>
            <p style={{textAlign: "left"}}>Ceci est une description</p>
            <h4 style={{textAlign: "left"}}>Durée: <span className="duree">14</span></h4>
            <div className="card-fav-split" style={{display: "flex"}}>
              <div className="card-fav-split-left" style={{display: "flex", flexDirection: "column", flexGrow: 1, padding: "12px, 0px"}}>
                <div className="badgeCategorie">Relaxation</div>
                <div className="badgeType">Exercice</div>
              </div>
              <div className="card-fav-split-right" style={{flexGrow: 1}}>
                <button className="btnFavori"><i className="fa-solid fa-heart fa-3x"></i></button>
              </div>
            </div>

          </div>
        </div>
    </div>
  );
}
