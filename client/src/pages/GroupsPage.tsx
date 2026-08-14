import React, { useState, useEffect } from 'react';
import { Group } from '../types/groups';
import { groupsService } from '../api/groups';

export function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [presentations, setPresentations] = useState<{ [groupId: string]: string }>({});
  const [statusMessages, setStatusMessages] = useState<{ [groupId: string]: string }>({});

  const loadGroups = async (filterText: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupsService.fetchGroups(filterText);
      setGroups(data);
    } catch (err: any) {
      setError(err.response?.data?.erreur || 'Erreur lors du chargement des groupes.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinAction = async (groupId: string, isPrivate: boolean) => {
    const introText = presentations[groupId] || '';

    if (isPrivate && !introText.trim()) {
      setStatusMessages(prev => ({ ...prev, [groupId]: '❌ Une présentation est requise.' }));
      return;
    }

    try {
      const res = await groupsService.joinGroup(groupId, introText);
      setStatusMessages(prev => ({
        ...prev,
        [groupId]: isPrivate ? '⏳ Demande d\'adhésion transmise !' : '✅ Groupe rejoint !'
      }));
      loadGroups(search);
    } catch (err: any) {
      setStatusMessages(prev => ({
        ...prev,
        [groupId]: `❌ ${err.response?.data?.erreur || 'Erreur d\'adhésion.'}`
      }));
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', color: '#1e293b', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      <header style={{ marginBottom: '32px', borderBottom: '2px solid #1e293b', paddingBottom: '16px' }}>
        <h1 style={{ color: '#0f172a', margin: '0 0 4px 0', fontSize: '28px', fontWeight: 'bold' }}>📋 ACCUEIL & DASHBOARD</h1>
        <p style={{ color: '#475569', margin: 0, fontSize: '14px' }}>Résumé de la semaine et thématiques de signalement</p>
      </header>

      <section style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '16px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>[ SEARCH ]</label>
            <input
              type="text"
              placeholder="Rechercher une thématique ou ressource..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '4px', border: '1px solid #94a3b8', backgroundColor: '#f8fafc', color: '#0f172a' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>[ DURÉE ]</label>
            <select style={{ padding: '10px', borderRadius: '4px', border: '1px solid #94a3b8', backgroundColor: '#ffffff', color: '#0f172a', minWidth: '120px' }}>
              <option>Toutes</option>
              <option>Récents</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>[ TYPE ]</label>
            <select style={{ padding: '10px', borderRadius: '4px', border: '1px solid #94a3b8', backgroundColor: '#ffffff', color: '#0f172a', minWidth: '120px' }}>
              <option>Tous</option>
              <option>PUBLIC</option>
              <option>PRIVE</option>
            </select>
          </div>

          <button
            onClick={() => loadGroups(search)}
            style={{ alignSelf: 'flex-end', padding: '10px 24px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}
          >
            Filtrer
          </button>
        </div>
      </section>

      {loading && <p style={{ color: '#64748b', textAlign: 'center' }}>Chargement des ressources...</p>}
      {error && <p style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '4px' }}>⚠️ {error}</p>}

      <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#475569', marginBottom: '16px', textTransform: 'uppercase' }}>📌 Ress. Suggérées & Groupes</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {groups.map((group) => {
          const isPrivate = group.visibilite === 'PRIVE';
          return (
            <div
              key={group.id}
              style={{ backgroundColor: '#ffffff', borderRadius: '6px', padding: '20px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: isPrivate ? '#b91c1c' : '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    [{group.visibilite}]
                  </span>
                  <small style={{ color: '#94a3b8', fontSize: '12px' }}>DURÉE: XX</small>
                </div>

                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
                  {group.thematique}
                </h3>

                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
                  {group.description}
                </p>
              </div>

              <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>👥 {group._count?.membres || 0} membres</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>CAT: Signalement</span>
                </div>

                {isPrivate && (
                  <input
                    type="text"
                    placeholder="Pourquoi voulez-vous rejoindre ? (Requis)"
                    value={presentations[group.id] || ''}
                    onChange={(e) => setPresentations({ ...presentations, [group.id]: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', marginBottom: '8px', fontSize: '13px' }}
                  />
                )}

                <button
                  onClick={() => handleJoinAction(group.id, isPrivate)}
                  style={{ width: '100%', padding: '10px', backgroundColor: isPrivate ? '#475569' : '#0f172a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}
                >
                  {isPrivate ? "Demander l'accès" : "btn. Rejoindre"}
                </button>

                {statusMessages[group.id] && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', textAlign: 'center', fontWeight: '500', color: statusMessages[group.id].startsWith('❌') ? '#dc2626' : '#16a34a' }}>
                    {statusMessages[group.id]}
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
