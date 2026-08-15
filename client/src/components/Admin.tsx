import React, { useState, useEffect } from 'react';
import { signalementsService } from '../api/signalements';

export type CategorieSignalement = 'INAPPROPRIE' | 'SPAM' | 'INQUIETANT';
export type StatutSignalement = 'EN_ATTENTE' | 'TRAITE' | 'REJETE';

export interface Signalement {
  id: string;
  utilisateurId: string;
  categorie: CategorieSignalement;
  statut: StatutSignalement;
  messageId?: string | null;
  publicationId?: string | null;
  commentaireId?: string | null;
  creeLe: string;
  majLe: string;
}

export default function Admin() {
  const [reports, setReports] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadReportsQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await signalementsService.getPendingSignalements();
      setReports(data);
    } catch (err: any) {
      setError(err.response?.data?.erreur || 'Erreur lors de la récupération de la file de modération.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (id: string, resolutionAction: 'TRAITE' | 'REJETE') => {
    try {
      await signalementsService.moderateSignalement(id, resolutionAction);
      setReports(prev => prev.filter(item => item.id !== id));
      alert(`Signalement mis à jour avec le statut : ${resolutionAction}`);
    } catch (err: any) {
      alert(`⚠️ Erreur : ${err.response?.data?.erreur || 'Impossible de modérer le contenu.'}`);
    }
  };

  useEffect(() => {
    loadReportsQueue();
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ color: '#ef4444', margin: '0 0 4px 0', fontSize: '24px' }}>Module Administration : Gestion des Signalements</h1>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Vue isolée du panneau d'administration conforme aux spécifications du wireframe.</p>
      </header>

      {loading && <p style={{ color: '#94a3b8' }}>Chargement de la file des signalements...</p>}
      {error && <div style={{ backgroundColor: '#7f1d1d', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

      {!loading && reports.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
          <p style={{ color: '#94a3b8', margin: 0 }}>Aucun signalement en attente de traitement.</p>
        </div>
      )}

      <main style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reports.map((report) => (
          <div key={report.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', backgroundColor: '#7f1d1d', color: '#fca5a5' }}>
                Catégorie: {report.categorie}
              </span>
              <small style={{ color: '#64748b' }}>ID Signalement : {report.id}</small>
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#0f172a', borderRadius: '6px', borderLeft: '4px solid #ef4444' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Cible du contenu signalé :</p>
              {report.publicationId && <p style={{ margin: 0, fontSize: '13px' }}><strong>Type :</strong> Publication (ID: <code>{report.publicationId}</code>)</p>}
              {report.commentaireId && <p style={{ margin: 0, fontSize: '13px' }}><strong>Type :</strong> Commentaire (ID: <code>{report.commentaireId}</code>)</p>}
              {report.messageId && <p style={{ margin: 0, fontSize: '13px' }}><strong>Type :</strong> Message Privé (ID: <code>{report.messageId}</code>)</p>}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => handleResolveReport(report.id, 'TRAITE')}
                style={{ padding: '8px 16px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                ✓ Confirmer (Supprimer le contenu)
              </button>
              <button
                onClick={() => handleResolveReport(report.id, 'REJETE')}
                style={{ padding: '8px 16px', backgroundColor: '#475569', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                ✕ Rejeter (Fausse alerte)
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
