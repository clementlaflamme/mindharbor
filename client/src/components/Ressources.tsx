import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../api/api";
import "./css/ressources.css";
import { useAuth } from "../api/context/AuthContext";


interface Ressource {
    id: string;
    titre: string;
    contenu: string;
    categorie: string;
    duree: number;
    niveau: number;
}

interface Favori {
    id: string;
    utilisateurId: string;
    ressourceId: string;
    ressource: Ressource;

}

export default function Ressources() {

  const {estConnecte} = useAuth(); // necessaire pour afficher la suggestion contextuelle
  const [recherche, setRecherche] = useState("");
  const [termeRecherche, setTermeRecherche] = useState("");
  const [categorie, setCategorie] = useState("");
  const [duree, setDuree] = useState("");
  const [niveau, setNiveau] = useState("");
  const [ressSuggeree, setRessSuggeree] = useState("");
  const [listeRessources, setListeRessources] = useState<Ressource[]>([]);
  const [filtreFavoris, setFiltreFavoris] = useState<boolean>(false);
  const [favoris, setFavoris] = useState<Set<string>>(new Set());
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

  const recupererFavoris = async () => {
    if (!estConnecte) {
      setFavoris(new Set());
      return
    }
    try {
      const reponse = await api.get<Favori[]>("/api/v1/me/fav");
      const ids = new Set(reponse.data.map((f) => f.ressourceId));
      setFavoris(ids);
    } catch (err: any) {
      console.error("Erreur de récupération des favoris", err);
    }
  }

  useEffect(() => {
    recupererListeRessources();
  }, []);

  useEffect(() => {
    recupererFavoris();
  }, [estConnecte]);

  const toggleFavori = async (ressourceId: string) => {
    if (!estConnecte) return;
    const estDejaFavori = favoris.has(ressourceId);

    setFavoris((prev) => {
      const copie = new Set(prev);
      estDejaFavori ? copie.delete(ressourceId) : copie.add(ressourceId);
      return copie;
  });

  try {
    if (estDejaFavori) {
      await api.delete(`/api/v1/resources/${ressourceId}/favorite`);
    } else {
      await api.post(`/api/v1/resources/${ressourceId}/favorite`)
    }
  } catch (err: any) {
    console.error("Erreur lors du changement d'état du favoris.", err);

    setFavoris((prev) => {
      const copie = new Set(prev);
      estDejaFavori ? copie.add(ressourceId) : copie.delete(ressourceId);
      return copie;
    });
  }
  };

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
    let correspondDuree = true;
    if (duree === "court") {
      correspondDuree = r.duree <= 2;
    } else if (duree === "moyen") {
      correspondDuree = r.duree <= 8;
    } else if (duree === "long") {
      correspondDuree = r.duree > 9;
    }

    const correspondFavori = !filtreFavoris || favoris.has(r.id);

    return correspondRecherche && correspondCategorie && correspondNiveau && correspondDuree && correspondFavori;
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
                    <option value="court">Court (max 2 mins)</option>
                    <option value="moyen">Moyen (max 8 mins)</option>
                    <option value="long">Long (plus de 8 mins)</option>
                </select>

                <select name="dropNiveau" id="dropNiveau" value={niveau} onChange={(e) => setNiveau(e.target.value)}>
                  <option value="">Tous les niveaux</option>
                  {niveauxDisponibles.map((niv) => (
                  <option key={niv} value={niv}>Niveau {niv}</option>
                  ))}
                </select>

                {estConnecte && (
                  <label>
                    <input
                      type="checkbox"
                      checked={filtreFavoris}
                      onChange={(e) => setFiltreFavoris(e.target.checked)}
                    />
                    Voir seulement mes favoris <i className="fa-solid fa-heart"></i>
                  </label>
                )}

                {!estConnecte && (
                  <p>Connectez-vous pour ajouter des favoris! <i className="fa-solid fa-heart"></i></p>
                )}

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
              {ressourcesFiltrees.map((r: any) => {
                const estFavori = favoris.has(r.id);
                return (
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
                      <button className="btnFavori" onClick={() => toggleFavori(r.id)} disabled={!estConnecte} title={estConnecte ? "" : "Connectez-vous pour ajouter au favoris."}>
                        {estFavori ? (
                          <i className="fa-solid fa-heart fa-3x"></i>
                        ) : (
                          <i className="fa-regular fa-heart fa-3x"></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>


    </div>
  );
}
