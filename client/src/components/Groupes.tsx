import React, { useState, useEffect } from 'react';
import { groupsService } from '../api/groups';
import { Admin } from './Admin';
import "./css/groupes.css"

export type VisibiliteGroupe = 'PUBLIC' | 'PRIVE';
export type StatutAdhesion = 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';

export interface CompteMembres {
  membres: number;
}

export interface Groupe {
  id: string;
  thematique: string;
  description: string;
  regles: string;
  visibilite: VisibiliteGroupe;
  creeLe: string;
  majLe: string;
  _count: CompteMembres;
}

export interface Commentaire {
  id: string;
  publicationId: string;
  contenu: string;
  auteur: { pseudonyme: string };
  creeLe: string;
}

export interface Publication {
  id: string;
  groupeId: string;
  contenu: string;
  utilisateur: { pseudonyme: string; avatarUrl: string };
  commentaires: Commentaire[];
  creeLe: string;
}

export default function Groupes() {
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [recherche, setRecherche] = useState<string>('');
  const [chargement, setChargement] = useState<boolean>(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [typeSelectionne, setTypeSelectionne] = useState<string>('Tous');
  const [ongletActif, setOngletActif] = useState<'groupes' | 'admin'>('groupes');
  const [presentations, setPresentations] = useState<{ [groupeId: string]: string }>({});
  const [messagesStatut, setMessagesStatut] = useState<{ [groupeId: string]: string }>({});
  const [nouvelleThematique, setNouvelleThematique] = useState<string>('');
  const [afficherFormulaireCreation, setAfficherFormulaireCreation] = useState<boolean>(false);
  const [visibiliteNouvelle, setVisibiliteNouvelle] = useState<'PUBLIC' | 'PRIVE'>('PUBLIC');

  const [groupeSelectionne, setGroupeSelectionne] = useState<Groupe | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [nouveauPost, setNouveauPost] = useState<string>('');
  const [nouveauCommentaire, setNouveauCommentaire] = useState<{ [postId: string]: string }>({});
  const [demandesEnAttente, setDemandesEnAttente] = useState<string[]>([]);




  const chargerGroupes = async (texteFiltrage: string = recherche, typeFiltré: string = typeSelectionne) => {
    setChargement(true);
    setErreur(null);
    try {

      const token = localStorage.getItem('token');
      const reponse = await fetch(`http://localhost:5000/api/groupes?recherche=${encodeURIComponent(texteFiltrage)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!reponse.ok) throw new Error("Impossible de récupérer les groupes.");

      const baseDonneesReelle = await reponse.json();

      const resultatsFiltres = baseDonneesReelle.filter((groupe: any) => {
        let correspondType = true;
        if (typeFiltré === 'PUBLIC') correspondType = groupe.visibilite === 'PUBLIC';
        if (typeFiltré === 'PRIVE') correspondType = groupe.visibilite === 'PRIVE';
        return correspondType;
      });

      setGroupes(resultatsFiltres); //
    } catch (err: any) {
      setErreur(err.message || "Une erreur est survenue");
    } finally {
      setChargement(false);
    }
  };


  const chargerPublicationsDuGroupe = async (groupeId: string) => {
    setChargement(true);
    try {
      const token = localStorage.getItem('token');
      const reponse = await fetch(`http://localhost:5000/api/groupes/${groupeId}/publications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!reponse.ok) throw new Error("Accès refusé ou groupe introuvable.");

      const donnees = await reponse.json();

      setPublications(donnees.publications);
    } catch (err: any) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  const ouvrirChatDuGroupe = (groupe: Groupe) => {
    setGroupeSelectionne(groupe);
    chargerPublicationsDuGroupe(groupe.id);
  };

  // 🛠️ CORRECTION : Passage de l'objet 'groupe' au lieu de juste son ID pour éviter l'erreur de compilation
  const gererActionAdhesion = async (groupe: Groupe, estPrive: boolean) => {
    const texteIntro = presentations[groupe.id] || '';

    if (estPrive && !texteIntro.trim()) {
      setMessagesStatut(prev => ({ ...prev, [groupe.id]: '❌ Une présentation est requise.' }));
      return;
    }

    // Une fois l'adhésion validée, on ouvre le chat directement
    setGroupeSelectionne(groupe);
    chargerPublicationsDuGroupe(groupe.id);
  };

  const gererAjouterPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauPost.trim() || !groupeSelectionne) return;

    const nouvellePub: Publication = {
      id: `post-${Date.now()}`,
      groupeId: groupeSelectionne.id,
      contenu: nouveauPost,
      utilisateur: { pseudonyme: "Moi (Étudiant)", avatarUrl: "" },
      creeLe: "À l'instant",
      commentaires: []
    };

    setPublications([nouvellePub, ...publications]);
    setNouveauPost('');
  };

  const gererAjouterCommentaire = (postId: string) => {
    const texteComm = nouveauCommentaire[postId] || '';
    if (!texteComm.trim()) return;

    setPublications(publications.map(pub => {
      if (pub.id === postId) {
        const nouveauCom: Commentaire = {
          id: `com-${Date.now()}`,
          publicationId: postId,
          contenu: texteComm,
          auteur: { pseudonyme: "Moi (Étudiant)" },
          creeLe: "À l'instant"
        };
        return { ...pub, commentaires: [...pub.commentaires, nouveauCom] };
      }
      return pub;
    }));

    setNouveauCommentaire(prev => ({ ...prev, [postId]: '' }));
  };

  useEffect(() => {
    chargerGroupes('', 'Tous');
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: '#e1d9d5', color: '#1e293b', minHeight: '80vh', fontFamily: 'sans-serif', overflowY: 'auto', paddingBottom: '140px' }}>

      <header style={{ marginBottom: '32px', borderBottom: '2px solid #7e9fc2', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#0f172a', margin: '0 0 4px 0', fontSize: '24px', fontWeight: 'bold' }}>Écran Groupes</h1>
          <p style={{ color: '#475569', margin: 0, fontSize: '14px' }}>Parcourez les thématiques de signalement</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#d1c7c2', padding: '4px', borderRadius: '6px' }}>
          <button onClick={() => { setOngletActif('groupes'); setGroupeSelectionne(null); }} style={{ padding: '8px 16px', backgroundColor: ongletActif === 'groupes' && !groupeSelectionne ? '#7e9fc2' : 'transparent', color: ongletActif === 'groupes' && !groupeSelectionne ? 'white' : '#475569', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Consulter les Groupes
          </button>
          <button onClick={() => setOngletActif('admin')} style={{ padding: '8px 16px', backgroundColor: ongletActif === 'admin' ? '#b22222' : 'transparent', color: ongletActif === 'admin' ? 'white' : '#475569', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Modération (Admin)
          </button>
        </div>
      </header>
      {ongletActif === 'admin' ? (
        <Admin />
      ) : groupeSelectionne ? (

        /* BOÎTE 1 : L'ESPACE DE DISCUSSION (Affiche les posts) */
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', minHeight: '80vh', display: 'flex', flexDirection: 'column', position: 'relative', textAlign: 'left' }}>

          {/* BARRE DU HAUT FIXE : Alignée à gauche */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #7e9fc2', backgroundColor: '#faf8f7', borderRadius: '6px 6px 0 0', textAlign: 'left' }}>
            <button
              onClick={() => setGroupeSelectionne(null)}
              style={{ marginBottom: '12px', padding: '6px 12px', backgroundColor: '#7e9fc2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ← Retour aux groupes
            </button>
            <h2 style={{ color: '#0f172a', margin: '0 0 4px 0', fontSize: '20px', textAlign: 'left' }}>{groupeSelectionne.thematique}</h2>
            <p style={{ color: '#475569', margin: 0, fontSize: '13px', textAlign: 'left' }}>{groupeSelectionne.description}</p>
          </div>

          {/* ZONE CENTRALE DES MESSAGES : Alignée strictement à gauche */}
          <div style={{ flexGrow: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', gap: '16px', maxHeight: '400px', textAlign: 'left' }}>
            {publications.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>
                Aucune publication dans ce groupe. Écrivez le premier message ci-dessous !
              </p>
            ) : (
              publications.map((pub) => (
                <div key={pub.id} style={{ backgroundColor: '#faf8f7', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '16px', alignSelf: 'stretch', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', textAlign: 'left' }}>
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>👤 {pub.utilisateur.pseudonyme}</span>
                    <span style={{ color: '#94a3b8' }}>{pub.creeLe}</span>
                  </div>
                  <p style={{ margin: 0, color: '#1e293b', fontSize: '14px', lineHeight: '1.4', textAlign: 'left' }}>{pub.contenu}</p>
                </div>
              ))
            )}
          </div>

          {/* ZONE DE TEXTE ET BOUTON FIXÉS TOUT EN BAS */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e1d9d5', backgroundColor: '#fcfaf9', borderRadius: '0 0 6px 6px', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', textAlign: 'left' }}>
              <textarea
                placeholder="Écrivez votre message ou commentaire ici..."
                value={nouveauPost}
                onChange={(e) => setNouveauPost(e.target.value)}
                style={{ flex: 1, boxSizing: 'border-box', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#1e293b', minHeight: '44px', maxHeight: '80px', resize: 'none', fontFamily: 'sans-serif', fontSize: '14px', textAlign: 'left' }}
              />
              <button
                onClick={() => {
                  if (!nouveauPost.trim()) return;

                  const nouvellePublication = {
                    id: `post-${Date.now()}`,
                    groupeId: groupeSelectionne.id,
                    contenu: nouveauPost,
                    utilisateur: { pseudonyme: "Moi (Étudiant)", avatarUrl: "" },
                    creeLe: "À l'instant",
                    commentaires: []
                  };

                  setPublications([nouvellePublication, ...publications]);
                  setNouveauPost('');
                }}
                style={{ padding: '12px 20px', backgroundColor: '#7e9fc2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '13px', whiteSpace: 'nowrap', height: '44px' }}
              >
                Envoyer
              </button>
            </div>
          </div>

        </div>

      ) : (

        /* BOÎTE 2 : LE CATALOGUE GÉNÉRAL DES GROUPES */
        <>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'stretch', marginTop: '20px' }}>

            {/* 📋 COLONNE DE GAUCHE : LISTE VERTICALE DES GROUPES REJOINTS */}
            <aside style={{ width: '260px', minWidth: '260px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', textAlign: 'left', height: 'fit-content' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#475569', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #7e9fc2', paddingBottom: '8px' }}>
                Mes Groupes Rejoints
              </h3>

              {/* Boucle d'affichage dynamique des groupes réels */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {groupes.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Aucun groupe trouvé</p>
                ) : (
                  groupes.map((groupe: any) => (
                    <button
                      key={groupe.id}
                      onClick={() => ouvrirChatDuGroupe(groupe.id)}
                      style={{ padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#1e293b', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    >
                      <span>{groupe.thematique}</span>
                      <span style={{ fontSize: '11px', color: '#64748b', block: 'block', fontWeight: 'normal', marginTop: '2px' }}>
                        {groupe.visibilite === 'PUBLIC' ? 'Public' : 'Privé'}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </aside>

            {/* COLONNE DE DROITE */}
            <div style={{ flexGrow: 1 }}>

          {/* Formulaire de filtrage */}
          <section style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>[ RECHERCHE ]</label>
                <input
                  type="text"
                  placeholder="Rechercher par nom de groupe..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#faf8f7', color: '#1e293b' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>[ CREATION ]</label>
                <select style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#1e293b', minWidth: '120px' }}><option>Toutes</option></select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>[ TYPE ]</label>
                <select value={typeSelectionne} onChange={(e) => setTypeSelectionne(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#1e293b', minWidth: '120px' }}>
                  <option value="Tous">Tous</option>
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="PRIVE">PRIVE</option>
                </select>
              </div>

              <div style={{ alignSelf: 'flex-end', display: 'flex', gap: '10px', height: '40px' }}>
                <button
                  onClick={() => chargerGroupes(recherche, typeSelectionne)}
                  style={{ padding: '10px 24px', backgroundColor: '#7e9fc2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '100%', boxSizing: 'border-box' }}
                >
                  Filtrer
                </button>
                <button
                  onClick={() => setAfficherFormulaireCreation(!afficherFormulaireCreation)}
                  style={{ padding: '10px 16px', backgroundColor: '#2e8b57', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '100%', boxSizing: 'border-box', whiteSpace: 'nowrap' }}
                >
                  ➕ Créer un Groupe
                </button>
              </div>

            </div>

            {afficherFormulaireCreation && (
              <div style={{ marginTop: '20px', borderTop: '1px solid #cbd5e1', paddingTop: '16px', display: 'flex', gap: '12px', alignItems: 'flex-end', textAlign: 'left', flexWrap: 'wrap' }}>

                {/* CHAMP NOM DU GROUPE */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                    [ Thématique du Nouveau Groupe ]
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Groupe de soutiens pour l'Anxiete"
                    value={nouvelleThematique}
                    onChange={(e) => setNouvelleThematique(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#faf8f7', color: '#1e293b' }}
                  />
                </div>

                {/* NOUVEAU SÉLECTEUR DE VISIBILITÉ */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                    [ Visibilité ]
                  </label>
                  <select
                    value={visibiliteNouvelle}
                    onChange={(e) => setVisibiliteNouvelle(e.target.value as 'PUBLIC' | 'PRIVE')}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#1e293b', minWidth: '120px', height: '40px', boxSizing: 'border-box' }}
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="PRIVE">PRIVE</option>
                  </select>
                </div>

                {/* BOUTON CONFIRMER AVEC TYPE DYNAMIQUE */}
                <button
                  onClick={() => {
                    if (!nouvelleThematique.trim()) return;

                    const nouveauGroupe = {
                      id: `groupe-${Date.now()}`,
                      thematique: visibiliteNouvelle === 'PRIVE' ? `${nouvelleThematique}` : `${nouvelleThematique}`,
                      description: "Nouveau groupe créé par la communauté pour la coordination des signalements citoyens locaux.",
                      visibilite: visibiliteNouvelle,
                      _count: { membres: 1 }
                    };

                    setGroupes([nouveauGroupe, ...groupes]);
                    setNouvelleThematique('');
                    setVisibiliteNouvelle('PUBLIC');
                    setAfficherFormulaireCreation(false);
                    alert(`✅ Groupe ${visibiliteNouvelle.toLowerCase()} ajouté avec succès !`);
                  }}
                  style={{ padding: '10px 20px', backgroundColor: '#7e9fc2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px', boxSizing: 'border-box' }}
                >
                  Confirmer
                </button>
              </div>
            )}
          </section>

          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#475569', marginBottom: '16px', textTransform: 'uppercase' }}>Groupes</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {groupes.map((groupe) => {
              const estUnGroupePrive = groupe.visibilite === 'PRIVE';

              return (
                <div key={groupe.id} style={{ backgroundColor: '#ffffff', borderRadius: '6px', padding: '20px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: estUnGroupePrive ? '#b22222' : '#2e8b57', textTransform: 'uppercase' }}>
                        [{groupe.visibilite}]
                      </span>
                      <small style={{ color: '#475569', fontSize: '12px' }}>Ceation: XX</small>
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{groupe.thematique}</h3>
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>{groupe.description}</p>
                  </div>

                  <div style={{ marginTop: 'auto', borderTop: '1px solid #e1d9d5', paddingTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>👥 {groupe._count?.membres || 0} membres</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>CAT: Signalement</span>
                    </div>

                    {/* 1. UN SEUL CHAMP DE TEXTE PROPRE POUR LE GROUPE PRIVÉ */}
                    {groupe.visibilite === 'PRIVE' && !demandesEnAttente.includes(groupe.id) && (
                      <input
                        type="text"
                        placeholder="Pourquoi voulez-vous rejoindre ? (Requis)"
                        value={presentations[groupe.id] || ''}
                        onChange={(e) => setPresentations({ ...presentations, [groupe.id]: e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#faf8f7', marginBottom: '8px', fontSize: '13px' }}
                      />
                    )}

                    {/* 2. LE BADGE DE CONFIRMATION OU LE BOUTON REJOINDRE/DEMANDER L'ACCÈS */}
                    {groupe.visibilite === 'PRIVE' && demandesEnAttente.includes(groupe.id) ? (
                      <div style={{ width: '100%', padding: '10px', backgroundColor: '#ccd7b0', color: '#475569', border: '1px solid #ccd7b0', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>
                        ⏳ Demande d'accès en attente de confirmation
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (groupe.visibilite === 'PRIVE') {
                            if (!(presentations[groupe.id] || '').trim()) {
                              setMessagesStatut(prev => ({ ...prev, [groupe.id]: '❌ Une présentation est requise.' }));
                              return;
                            }
                            setDemandesEnAttente(prev => [...prev, groupe.id]);
                            setMessagesStatut(prev => ({ ...prev, [groupe.id]: '✅ Demande transmise !' }));
                          } else {
                            setGroupeSelectionne(groupe);
                            chargerPublicationsDuGroupe(groupe.id);
                          }
                        }}
                        style={{ width: '100%', padding: '10px', backgroundColor: groupe.visibilite === 'PRIVE' ? '#475569' : '#7e9fc2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}
                      >
                        {groupe.visibilite === 'PRIVE' ? "Demander l'accès" : "Rejoindre"}
                      </button>
                    )}

                    {messagesStatut[groupe.id] && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '12px', textAlign: 'center', fontWeight: '500', color: '#b22222' }}>{messagesStatut[groupe.id]}</p>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

            </div>
          </div>
        </>
      )}

    </div>
  );
}