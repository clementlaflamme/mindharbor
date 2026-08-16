import { useState, useEffect } from "react";
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
    creeLe: string;
    type: string;
    url: string;
}

interface Favori {
    id: string;
    utilisateurId: string;
    ressourceId: string;
    ressource: Ressource;
}

interface ReponseSuggestions {
  categoriesTroubles?: string;
  categoriesEntreeDate?: string;
  suggestions?: Ressource[];
  message?: string;
}

function capitaliser(valeur: string): string {
  if (!valeur) return valeur;
  return valeur.charAt(0).toUpperCase() + valeur.slice(1).toLowerCase();
}

export default function Ressources() {

  const {estConnecte} = useAuth(); // necessaire pour afficher la suggestion contextuelle
  const [recherche, setRecherche] = useState("");
  const [termeRecherche, setTermeRecherche] = useState("");
  const [categorie, setCategorie] = useState("");
  const [duree, setDuree] = useState("");
  const [niveau, setNiveau] = useState("");
  const [ressSuggeree, setRessSuggeree] = useState<Ressource | null>(null);
  const [messageSuggestion, setMessageSuggestion] = useState("");
  const [listeRessources, setListeRessources] = useState<Ressource[]>([]);
  const [filtreFavoris, setFiltreFavoris] = useState<boolean>(false);
  const [favoris, setFavoris] = useState<Set<string>>(new Set());
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur, setErreur] = useState("");
  const [pageAffichee, setPageAffichee] = useState(1);
  const RESSOURCES_PAR_PAGE = 8;



  const recupererListeRessources = async () => {
    try {
      setChargement(true);
      // envoi de la query de recherche
      const premiereReponse = await api.get<{ ressources: Ressource[], totalPages: number }>("/api/v1/resources", {params: {page: 1, limit: 50} });

      let toutesLesRessources = [...premiereReponse.data.ressources];
      const totalPages = premiereReponse.data.totalPages;

      if (totalPages > 1) {
        const requetesRestantes = [];
        for (let page = 2; page <= totalPages; page++) {
          requetesRestantes.push(
            api.get<{ressources: Ressource[]}>("/api/v1/resources", {
              params: {page, limit: 50},
            })
          );
        }
        const reponsesRestantes = await Promise.all(requetesRestantes);
        reponsesRestantes.forEach((reponse) => {
          toutesLesRessources = [...toutesLesRessources, ...reponse.data.ressources];
        });
      }

      setListeRessources(toutesLesRessources);
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
      const reponse = await api.get<Favori[]>("/api/v1/resources/me/fav");
      const ids = new Set(reponse.data.map((f) => f.ressourceId));
      setFavoris(ids);
    } catch (err: any) {
      console.error("Erreur de récupération des favoris", err);
    }
  }

  const recupererSuggestion = async () => {
    if (estConnecte) {
      //si on est connecté
      try{
        const reponse = await api.get<ReponseSuggestions>("/api/v1/resources/me/suggestions");
        const suggestions = reponse.data.suggestions;

        if (suggestions && suggestions.length > 0) {
          const indexAleatoire = Math.floor(Math.random() * suggestions.length);
          setRessSuggeree(suggestions[indexAleatoire]);
          setMessageSuggestion("");
        } else {
          setRessSuggeree(null);
          setMessageSuggestion("Vous êtes sur la bonne voie!")
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setRessSuggeree(null);
          setMessageSuggestion("Aucune suggestion disponible pour le moment,\nremplissez votre journal pour en avoir en cas de mauvais jours.")
        }
      }
    } else {
      // si on n'est pas connecté, on affiche la plus récente des ressources
      setMessageSuggestion("Dernière ressource ajoutée:");
      if (listeRessources.length > 0) {
        // on trie la liste par date de la plus récente a la plus vieille puis on prend la première entrée
        const plusRecente = [...listeRessources].sort(
          (a,b) => new Date(b.creeLe).getTime() - new Date(a.creeLe).getTime())[0];
          setRessSuggeree(plusRecente);
      }
    }
  }

  useEffect(() => {
    recupererListeRessources();
  }, []);

  useEffect(() => {
    recupererFavoris();
  }, [estConnecte]);

  useEffect(() => {
    recupererSuggestion();
  }, [estConnecte, listeRessources])

  useEffect(() => {
    setPageAffichee(1);
  }, [termeRecherche, categorie, duree, niveau, filtreFavoris])

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

  const totalPagesAffichees = Math.max(1, Math.ceil(ressourcesFiltrees.length / RESSOURCES_PAR_PAGE));
  const ressourcesAffichees = ressourcesFiltrees.slice(
    (pageAffichee - 1) * RESSOURCES_PAR_PAGE,
    pageAffichee * RESSOURCES_PAR_PAGE
  );

  const categoriesDisponibles = [...new Set(listeRessources.map((r) => r.categorie))];
  const niveauxDisponibles = [...new Set(listeRessources.map((r) => r.niveau))].sort((a,b) => a - b);


  return (
    <div className="container-ressources" style={{display: "flex", flexGrow: 1, flexDirection: "column"}}>
        <div style={{display: "flex", minWidth: "100%", }}>
            <h2 style={{justifyContent: "flex-start", paddingLeft: "32px", flexGrow: 1}}>Ressources d'aide</h2>
            <h2 style={{justifyContent: "flex-end", paddingRight: "32px", flexGrow: 1}}>
              {estConnecte ? "Suggéré pour vous" : "Ressource récente"}
            </h2>
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
              <div className="ress-top-right b-rad25" style={{flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center"}}>
                {ressSuggeree ? (
                  (() => {
                    const estFavori = favoris.has(ressSuggeree.id);
                    return (
                      <div key={ressSuggeree.id} onClick={() => window.open(ressSuggeree.url, "_blank")} className="card b-rad25" style={{display: "flex", flexDirection: "column"}}>
                        <h3 style={{textAlign: "left", minHeight: "3.5rem", alignItems:"flex-start"}}>{ressSuggeree.titre}</h3>
                        <h5 style={{textAlign: "left", minHeight: "1.5rem", margin: "8px 0"}}>Niveau <span className="duree">{ressSuggeree.niveau}</span></h5>
                        <p style={{textAlign: "left", minHeight: "3rem", flexGrow: 1}}>{ressSuggeree.contenu}</p>
                        <h4 style={{textAlign: "left", minHeight: "1.5rem", margin: "8px 0"}}>Durée: <span className="duree">{ressSuggeree.duree} minutes</span></h4>
                        <div className="card-fav-split" style={{display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1}}>
                          <div className="card-fav-split-left" style={{display: "flex", flexDirection: "column", flexGrow: 1, padding: "12px, 0px"}}>
                            <div className="badgeCategorie">{ressSuggeree.categorie}</div>
                            <div className="badgeType">{capitaliser(ressSuggeree.type)}</div>
                          </div>
                        <div className="card-fav-split-right" style={{display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1}}>
                          <button className="btnFavori"
                            onClick={(e) => {e.stopPropagation(); toggleFavori(ressSuggeree.id);}}
                            disabled={!estConnecte}
                            hidden={!estConnecte}
                            title={estConnecte ? "" : "Connectez-vous pour ajouter au favoris."}
                          >
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
                  })()
                ) : messageSuggestion ? (
                  <div className="card b-rad25" style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <p style={{textAlign: "center"}}>{messageSuggestion}</p>
                  </div>
                ) : (
                  <p>Chargement de la suggestion...</p>
                )}
              </div>
        </div>
        
        <div className="ress-bot" style={{display: "grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))" , flexGrow: 2, flexWrap: "wrap", gap: "8px"}}>
          {chargement && <p>Chargement des ressources...</p>}
          {erreur && <p style={{ color: "red" }}>{erreur}</p>}
          {!chargement && ressourcesAffichees.length === 0 && (
            <p>Aucune ressource ne correspond à votre recherche.</p>
            )}
              {ressourcesAffichees.map((r: any) => {
                const estFavori = favoris.has(r.id);
                return (
                <div key={r.id} className="card b-rad25" onClick={() => window.open(r.url, "_blank")} style={{display: "flex", flexDirection: "column"}}>
                  <h3 style={{textAlign: "left", minHeight: "3.5rem", alignItems:"flex-start"}}>{r.titre}</h3>
                  <h5 style={{textAlign: "left", minHeight: "1.5rem", margin: "8px 0"}}>Niveau <span className="duree">{r.niveau}</span></h5>
                  <p style={{textAlign: "left", minHeight: "3rem", flexGrow: 1}}>{r.contenu}</p>
                  <h4 style={{textAlign: "left", minHeight: "1.5rem", margin: "8px 0"}}>Durée: <span className="duree">{r.duree} minutes</span></h4>
                  <div className="card-fav-split" style={{display: "flex", marginTop: "auto"}}>
                    <div className="card-fav-split-left" style={{display: "flex", flexDirection: "column", flexGrow: 1, padding: "12px, 0px"}}>
                      <div className="badgeCategorie">{r.categorie}</div>
                      <div className="badgeType">{capitaliser(r.type)}</div>
                    </div>
                    <div className="card-fav-split-right" style={{display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1}}>
                      <button className="btnFavori"
                        onClick={(e) => {e.stopPropagation(); toggleFavori(r.id);}}
                        disabled={!estConnecte}
                        hidden={!estConnecte}
                        title={estConnecte ? "" : "Connectez-vous pour ajouter au favoris."}
                      >
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

        {totalPagesAffichees > 1 && (
          <div className="arrowDiv" style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", padding: "16px"}}>
            <button
              onClick={() => setPageAffichee((p) => Math.max(1, p - 1))}
              disabled={pageAffichee === 1}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <span>Page {pageAffichee} / {totalPagesAffichees}</span>
            <button
              onClick={() => setPageAffichee((p) => Math.min(totalPagesAffichees, p + 1))}
              disabled={pageAffichee === totalPagesAffichees}
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}

    </div>
  );
}
