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
        {
          id: "1",
          thematique: "Signalement : Nids-de-poule Urgents",
          description: "Coordination citoyenne pour cartographier et signaler les bris de chaussée critiques avant les inspections de la ville.",
          regles: "Joindre des photos géolocalisées si possible.",
          visibilite: "PUBLIC",
          creeLe: new Date().toISOString(),
          majLe: new Date().toISOString(),
          _count: { membres: 18 }
        },
        {
          id: "2",
          thematique: "Éclairage Public Réseau Ouest",
          description: "Suivi communautaire des lampadaires en panne et zones de pénombre dangereuses signalées par les résidents.",
          regles: "Préciser le numéro de poteau ou l'intersection exacte.",
          visibilite: "PUBLIC",
          creeLe: new Date().toISOString(),
          majLe: new Date().toISOString(),
          _count: { membres: 7 }
        },
        {
          id: "3",
          thematique: "Modération & Signalements Sensibles",
          description: "Groupe privé de traitement pour l'analyse des cas de harcèlement, d'incivilités ou de rapports urgents.",
          regles: "Réservé aux administrateurs de la plateforme.",
          visibilite: "PRIVE",
          creeLe: new Date().toISOString(),
          majLe: new Date().toISOString(),
          _count: { membres: 4 }
        }
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
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', color: '#1e293b', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* En-tete */}
      <header style={{ marginBottom: '24px', borderBottom: '2px solid #1e293b', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ color: '#0f172a', margin: '0 0 4px 0', fontSize: '28px', fontWeight: 'bold' }}>📋 ACCUEIL & DASHBOARD</h1>
          <p style={{ color: '#475569', margin: 0, fontSize: '14px' }}>Résumé de la semaine et thématiques de signalement</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '6px' }}>
          <button
            onClick={() => setOngletActif('groupes')}
            style={{ padding: '8px 16px', backgroundColor: ongletActif === 'groupes' ? '#1e293b' : 'transparent', color: ongletActif === 'groupes' ? 'white' : '#475569', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
          >
            🌐 Consulter les Groupes
          </button>
          <button
            onClick={() => setOngletActif('admin')}
            style={{ padding: '8px 16px', backgroundColor: ongletActif === 'admin' ? '#ef4444' : 'transparent', color: ongletActif === 'admin' ? 'white' : '#475569', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
          >
            🛡️ Modération (Admin)
          </button>
        </div>
      </header>

      <section style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>

          {/* barre de recherche */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
              [ RECHERCHE ]
            </label>
            <input
              type="text"
              placeholder="Rechercher par nom de groupe..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '4px', border: '1px solid #94a3b8', backgroundColor: '#f8fafc', color: '#0f172a' }}
            />
          </div>



          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
              [ DURÉE ]
            </label>
            <select style={{ padding: '10px', borderRadius: '4px', border: '1px solid #94a3b8', backgroundColor: '#ffffff', color: '#0f172a', minWidth: '120px' }}>
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
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #94a3b8', backgroundColor: '#ffffff', color: '#0f172a', minWidth: '120px' }}
            >
              <option value="Tous">Tous</option>
              <option value="PUBLIC">PUBLIC</option>
              <option value="PRIVE">PRIVE</option>
            </select>
          </div>

          <button
            onClick={() => chargerGroupes(recherche, typeSelectionne)}
            style={{ alignSelf: 'flex-end', padding: '10px 24px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}
          >
            Filtrer
          </button>
        </div>
      </section>

      {chargement && <p style={{ color: '#64748b', textAlign: 'center' }}>Chargement des ressources...</p>}
      {erreur && <p style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '4px' }}>⚠️ {erreur}</p>}

      <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#475569', marginBottom: '16px', textTransform: 'uppercase' }}>
        Ress. Suggérées & Groupes
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {groupes.map((groupe) => {
          const estPrive = groupe.visibilite === 'PRIVE';
          return (
            <div key={groupe.id} style={{ backgroundColor: '#ffffff', borderRadius: '6px', padding: '20px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: estPrive ? '#b91c1c' : '#15803d', textTransform: 'uppercase' }}>
                    [{groupe.visibilite}]
                  </span>
                  <small style={{ color: '#94a3b8', fontSize: '12px' }}>DURÉE: XX</small>
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
                  {groupe.thematique}
                </h3>
                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
                  {groupe.description}
                </p>
              </div>

              <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
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
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', marginBottom: '8px', fontSize: '13px' }}
                  />
                )}

                <button
                  onClick={() => gererActionAdhesion(groupe.id, estPrive)}
                  style={{ width: '100%', padding: '10px', backgroundColor: estPrive ? '#475569' : '#0f172a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}
                >
                  {estPrive ? "Demander l'accès" : "Rejoindre"}
                </button>

                {messagesStatut[groupe.id] && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', textAlign: 'center', fontWeight: '500', color: messagesStatut[groupe.id].startsWith('❌') ? '#dc2626' : '#16a34a' }}>
                    {messagesStatut[groupe.id]}
                  </p>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}