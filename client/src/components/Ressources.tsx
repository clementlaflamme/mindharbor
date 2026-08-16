import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../api/api";
import "./css/ressources.css";
import { useAuth } from "../api/context/AuthContext";

interface Props {
  setPageActive: (page: string) => void;
}

interface Ressource {
    id: string;
    titre: string;
    contenu: string;
    categorie: string;
    duree: number;
    niveau: number;
}

function groupeDuree(duree: number): string {
  if (duree < 5) return "court";
  if (duree < 10) return "moyen";
  return "long";
}

export default function Ressources({setPageActive}: Props) {

  const {estConnecte} = useAuth(); // necessaire pour afficher la suggestion contextuelle
  const [recherche, setRecherche] = useState("");
  const [termeRecherche, setTermeRecherche] = useState("");
  const [categorie, setCategorie] = useState("");
  const [duree, setDuree] = useState("");
  const [niveau, setNiveau] = useState("");
  const [ressSuggeree, setRessSuggeree] = useState("");
  const [listeRessources, setListeRessources] = useState<Ressource[]>([]);
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur, setErreur] = useState("");



  const recupererListeRessources = async () => {
    try {
      setChargement(true);
      // envoi de la query de recherche
      const reponse = await api.get<{ ressources: Ressource[] }>("/api/v1/resources");
      setListeRessources(reponse.data.ressources);
    } catch (err: any) {
      console.error("Erreur API", err);
      setErreur("Erreur lors du chargement des ressources.");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    recupererListeRessources();
  }, []);

  // Gestion de la soumission du formulaire
  const soumettreRecherche = (e: React.FormEvent) => {
    e.preventDefault();
    setTermeRecherche(recherche);
  };

  // Liste filtrée avec la recherche
  const ressourcesFiltrees = listeRessources.filter((r) => {
    const terme = termeRecherche.trim().toLowerCase();

    const correspondRecherche = !terme || r.titre.toLowerCase().includes(terme) || r.contenu.toLowerCase().includes(terme);
    const correspondCategorie = !categorie || r.categorie === categorie;
    const correspondNiveau = !niveau || r.niveau === Number(niveau);
    // const correspondDuree = !duree || groupeDuree(r.duree) === duree;
    let correspondDuree = true;
    if (duree === "court") {
      correspondDuree = r.duree <= 2;
    } else if (duree === "moyen") {
      correspondDuree = r.duree <= 8;
    } else if (duree === "long") {
      correspondDuree = r.duree > 9;
    }

    return correspondRecherche && correspondCategorie && correspondNiveau && correspondDuree;
  });

  const categoriesDisponibles = [...new Set(listeRessources.map((r) => r.categorie))];
  const niveauxDisponibles = [...new Set(listeRessources.map((r) => r.niveau))].sort((a,b) => a - b);


  return (
    <div className="container-ressources" style={{display: "flex", flexGrow: 1, flexDirection: "column"}}>
        <div style={{display: "flex"}}>
            <h2 style={{justifyContent: "flex-start", paddingLeft: "32px"}}>Ressources d'aide</h2>
        </div>
        <div className="ress-top" style={{display: "flex", flexGrow: 1, flexDirection: "row"}}>
            <div className="ress-top-left b-rad25" style={{display: "flex", flexGrow: 1, alignContent: "center", justifyContent: "center", flexDirection: "column"}}>

                <form id="rechercheRessource" onSubmit={soumettreRecherche} style={{display: "flex",  gap: "18px"}}> 
                  <input type="search" id="champRecherche" name="champRecherche" placeholder="Rechercher titre ou contenu..." value={recherche} onChange={(e)=> setRecherche(e.target.value)} style={{flexGrow: 1}}></input>
                  <button>Rechercher</button>
                </form>

                <select name="dropCat " id="dropCat" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                    <option value="">Toutes les catégories</option>
                    {categoriesDisponibles.map((cat)=> (
                    <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select name="dropDuree " id="dropDuree" value={duree} onChange={(e) => setDuree(e.target.value)}>
                    <option value="">Toutes les durées</option>
                    <option value="court">Court (moins de 5 mins)</option>
                    <option value="moyen">Moyen (moins de 10 mins)</option>
                    <option value="long">Long (10 mins et plus)</option>
                </select>

                <select name="dropNiveau" id="dropNiveau" value={niveau} onChange={(e) => setNiveau(e.target.value)}>
                  <option value="">Tous les niveaux</option>
                  {niveauxDisponibles.map((niv) => (
                  <option key={niv} value={niv}>Niveau {niv}</option>
                  ))}
                </select>

                <button className="btnAfficherFavoris">Afficher les favoris <i className="fa-solid fa-heart"></i></button>
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
        
        <div className="ress-bot" style={{display: "grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))" , flexGrow: 2, flexWrap: "wrap", gap: "8px"}}>
          {chargement && <p>Chargement des ressources...</p>}
          {erreur && <p style={{ color: "red" }}>{erreur}</p>}
          {!chargement && ressourcesFiltrees.length === 0 && (
            <p>Aucune ressource ne correspond à votre recherche.</p>
            )}
              {ressourcesFiltrees.map((r: any) => (
                <div key={r.id} className="card b-rad25" style={{display: "flex", flexDirection: "column"}}>
                  <h3 style={{textAlign: "left"}}>{r.titre}</h3>
                  <h5 style={{textAlign: "left"}}>Niveau <span className="duree">{r.niveau}</span></h5>
                  <p style={{textAlign: "left"}}>{r.contenu}</p>
                  <h4 style={{textAlign: "left"}}>Durée: <span className="duree">{r.duree} minutes</span></h4>
                  <div className="card-fav-split" style={{display: "flex"}}>
                    <div className="card-fav-split-left" style={{display: "flex", flexDirection: "column", flexGrow: 1, padding: "12px, 0px"}}>
                      <div className="badgeCategorie">{r.categorie}</div>
                      <div className="badgeType">{r.type}</div>
                    </div>
                    <div className="card-fav-split-right" style={{display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1}}>
                      <button className="btnFavori"><i className="fa-solid fa-heart fa-3x"></i></button>
                    </div>
                  </div>

                </div>
              ))}
        </div>


    </div>
  );
}
