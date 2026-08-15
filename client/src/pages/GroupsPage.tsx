import React, { useState, useEffect } from 'react';
import { groupsService } from '../api/groups';
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

export function GroupsPage() {
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [recherche, setRecherche] = useState<string>('');
  const [chargement, setChargement] = useState<boolean>(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [typeSelectionne, setTypeSelectionne] = useState<string>('Tous');
  const [ongletActif, setOngletActif] = useState<'groupes' | 'admin'>('groupes');
  const [presentations, setPresentations] = useState<{ [groupeId: string]: string }>({});
  const [messagesStatut, setMessagesStatut] = useState<{ [groupeId: string]: string }>({});

  const chargerGroupes = async (texteFiltrage: string = recherche, typeFiltré: string = typeSelectionne) => {
    setChargement(true);
    setErreur(null);
    try {
      const baseDonneesFictive: Groupe[] = [

      ];

    const resultatsFiltres = baseDonneesFictive.filter(groupe => {
      const correspondMotCle = groupe.thematique.toLowerCase().includes(texteFiltrage.toLowerCase());

      let correspondType = true;
      if (typeFiltré === 'PUBLIC') correspondType = groupe.visibilite === 'PUBLIC';
      if (typeFiltré === 'PRIVE') correspondType = groupe.visibilite === 'PRIVE';

      return correspondMotCle && correspondType;
    });

      setGroupes(resultatsFiltres);


    } catch (err: any) {
      setErreur('Erreur lors du chargement des groupes.');
    } finally {
      setChargement(false);
    }
  };


  const gererActionAdhesion = async (groupeId: string, estPrive: boolean) => {
    const texteIntro = presentations[groupeId] || '';

    if (estPrive && !texteIntro.trim()) {
      setMessagesStatut(prev => ({ ...prev, [groupeId]: '❌ Une présentation est requise.' }));
      return;
    }

    try {
      await groupsService.joinGroup(groupeId, texteIntro);
      setMessagesStatut(prev => ({
        ...prev,
        [groupeId]: estPrive ? '⏳ Demande transmise !' : '✅ Groupe rejoint !'
      }));
      setPresentations(prev => ({ ...prev, [groupeId]: '' }));
      chargerGroupes(recherche);
    } catch (err: any) {
      setMessagesStatut(prev => ({
        ...prev,
        [groupeId]: `❌ ${err.response?.data?.erreur || "Erreur d'adhésion."}`
      }));
    }
  };

  useEffect(() => {
    chargerGroupes();
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: '#e1d9d5', color: '#1e293b', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      <header style={{ marginBottom: '32px', borderBottom: '2px solid #7e9fc2', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ color: '#0f172a', margin: '0 0 4px 0', fontSize: '28px', fontWeight: 'bold' }}>📋 ACCUEIL & DASHBOARD</h1>
          <p style={{ color: '#475569', margin: 0, fontSize: '14px' }}>Résumé de la semaine et thématiques de signalement</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#d1c7c2', padding: '4px', borderRadius: '6px' }}>
          <button
            onClick={() => setOngletActif('groupes')}
            style={{ padding: '8px 16px', backgroundColor: ongletActif === 'groupes' ? '#7e9fc2' : 'transparent', color: ongletActif === 'groupes' ? 'white' : '#475569', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
          >
            🌐 Consulter les Groupes
          </button>
          <button
            onClick={() => setOngletActif('admin')}
            style={{ padding: '8px 16px', backgroundColor: ongletActif === 'admin' ? '#b22222' : 'transparent', color: ongletActif === 'admin' ? 'white' : '#475569', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
          >
            🛡️ Modération (Admin)
          </button>
        </div>
      </header>

      {ongletActif === 'admin' ? (
        <section style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: '0 0 16px 0', color: '#b22222', fontSize: '20px', fontWeight: 'bold' }}>🛡️ Signalements en attente de traitement</h2>
          <p style={{ color: '#1e293b', fontSize: '14px', marginBottom: '20px' }}>File d'attente administrative pour la validation ou le rejet des signalements signalés par la communauté.</p>
          <div style={{ padding: '30px', textAlign: 'center', border: '2px dashed #b22222', borderRadius: '6px', color: '#b22222', backgroundColor: '#faf8f7' }}>
            ✓ Aucun signalement critique en attente dans votre juridiction.
          </div>
        </section>
      ) : (
        <>
          <section style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '16px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                  [ RECHERCHE ]
                </label>
                <input
                  type="text"
                  placeholder="Rechercher par nom de groupe..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#faf8f7', color: '#1e293b' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                  [ DURÉE ]
                </label>
                <select style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#1e293b', minWidth: '120px' }}>
                  <option>Toutes</option>
                  <option>Récents</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                  [ TYPE ]
                </label>
                <select
                  value={typeSelectionne}
                  onChange={(e) => setTypeSelectionne(e.target.value)}
                  style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#1e293b', minWidth: '120px' }}
                >
                  <option value="Tous">Tous</option>
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="PRIVE">PRIVE</option>
                </select>
              </div>

              <button
                onClick={() => chargerGroupes(recherche, typeSelectionne)}
                style={{ alignSelf: 'flex-end', padding: '10px 24px', backgroundColor: '#7e9fc2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}
              >
                Filtrer
              </button>

            </div>
          </section>

          {chargement && <p style={{ color: '#64748b', textAlign: 'center' }}>Chargement des ressources...</p>}
          {erreur && <p style={{ color: '#b22222', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '4px' }}>⚠️ {erreur}</p>}

          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#475569', marginBottom: '16px', textTransform: 'uppercase' }}>
          Groupes
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {groupes.map((groupe) => {
              const estPrive = groupe.visibilite === 'PRIVE';
              return (
                <div key={groupe.id} style={{ backgroundColor: '#ffffff', borderRadius: '6px', padding: '20px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: estPrive ? '#b22222' : '#2e8b57', textTransform: 'uppercase' }}>
                        [{groupe.visibilite}]
                      </span>
                      <small style={{ color: '#94a3b8', fontSize: '12px' }}>DURÉE: XX</small>
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                      {groupe.thematique}
                    </h3>
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
                      {groupe.description}
                    </p>
                  </div>

                  <div style={{ marginTop: 'auto', borderTop: '1px solid #e1d9d5', paddingTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>👥 {groupe._count?.membres || 0} membres</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>CAT: Signalement</span>
                    </div>

                    {estPrive && (
                      <input
                        type="text"
                        placeholder="Pourquoi voulez-vous rejoindre ? (Requis)"
                        value={presentations[groupe.id] || ''}
                        onChange={(e) => setPresentations({ ...presentations, [groupe.id]: e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#faf8f7', color: '#1e293b', marginBottom: '8px', fontSize: '13px' }}
                      />
                    )}

                    <button
                      onClick={() => gererActionAdhesion(groupe.id, estPrive)}
                      style={{ width: '100%', padding: '10px', backgroundColor: estPrive ? '#475569' : '#7e9fc2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}
                    >
                      {estPrive ? "Demander l'accès" : "Rejoindre"}
                    </button>

                    {messagesStatut[groupe.id] && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '12px', textAlign: 'center', fontWeight: '500', color: messagesStatut[groupe.id].startsWith('❌') ? '#b22222' : '#2e8b57' }}>
                        {messagesStatut[groupe.id]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );}