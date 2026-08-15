import React, { useState, useEffect } from 'react';
import { signalementsService } from '../api/signalements';
import { useAuth } from '../api/context/AuthContext';

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

export function Admin() {
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [chargement, setChargement] = useState<boolean>(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const { estAdmin } = useAuth();
  const [cibleSelect, setCibleSelect] = useState<string>('personne');
  const [motifSelect, setMotifSelect] = useState<CategorieSignalement>('INAPPROPRIE');


  const chargerFileModération = async () => {
    setChargement(true);
    setErreur(null);
    try {
      // Simulation locale étanche de la base de données Prisma pour la démo
      const baseDonneesFictive: Signalement[] = [
        {
          id: "SIG-301",
          utilisateurId: "citoyen_julie",
          categorie: "INAPPROPRIE",
          statut: "EN_ATTENTE",
          messageId: "msg_perso_884", // Signale une personne / un message privé
          creeLe: "Il y a 10 min",
          majLe: "Il y a 10 min"
        },
        {
          id: "SIG-302",
          utilisateurId: "citoyen_marc",
          categorie: "SPAM",
          statut: "EN_ATTENTE",
          publicationId: "groupe_eclairage_ouest", // Signale un groupe complet
          creeLe: "Il y a 2 heures",
          majLe: "Il y a 2 heures"
        }
      ];

      setSignalements(baseDonneesFictive);
    } catch (err: any) {
      setErreur('Erreur lors de la récupération des signalements.');
    } finally {
      setChargement(false);
    }
  };

  const gererResolution = (id: string, actionResolution: 'TRAITE' | 'REJETE') => {
    // Supprime l'element de la liste à l'écran après action administrative
    setSignalements(prev => prev.filter(item => item.id !== id));
  };

  const gererCreerSignalement = () => {
    // Génération dynamique du signalement selon la cible choisie par l'utilisateur
    const nouveauSig: Signalement = {
      id: `SIG-${Date.now().toString().slice(-4)}`,
      utilisateurId: "citoyen_anonyme",
      categorie: motifSelect,
      statut: "EN_ATTENTE",
      messageId: cibleSelect === 'personne' ? `msg_utilisateur_${Math.floor(Math.random() * 900 + 100)}` : null,
      publicationId: cibleSelect === 'groupe' ? `groupe_thematique_${Math.floor(Math.random() * 900 + 100)}` : null,
      creeLe: "À l'instant",
      majLe: "À l'instant"
    };

    setSignalements([nouveauSig, ...signalements]);
    alert("✅ Le signalement a été transmis à la file de traitement de la modération.");
  };

  useEffect(() => {
    chargerFileModération();
  }, []);


  return (
    <div style={{ padding: '24px', backgroundColor: '#e1d9d5', minHeight: '80vh', fontFamily: 'sans-serif', textAlign: 'left' }}>

      <section style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 12px 0', color: '#b22222', fontSize: '20px', fontWeight: 'bold' }}>
          Centre de Signalement & Sécurité
        </h2>


        {/* SECTION COMMUNE : Visible par tous les utilisateurs (Clients) */}

        <div style={{ backgroundColor: '#faf8f7', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '16px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Émettre un nouveau signalement
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px' }}>CIBLE DU RAPPORT</label>
              <select
                value={cibleSelect}
                onChange={(e) => setCibleSelect(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#1e293b', fontSize: '13px' }}
              >
                <option value="personne">Signaler une personne / message privé</option>
                <option value="groupe">Signaler un groupe complet / thématique</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px' }}>MOTIF DE L'ALERTE</label>
              <select
                value={motifSelect}
                onChange={(e) => setMotifSelect(e.target.value as CategorieSignalement)}
                style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#1e293b', fontSize: '13px' }}
              >
                <option value="INAPPROPRIE">INAPPROPRIE</option>
                <option value="SPAM">SPAM</option>
                <option value="INQUIETANT">INQUIETANT</option>
              </select>
            </div>

            <button
              onClick={gererCreerSignalement}
              style={{ padding: '8px 20px', backgroundColor: '#7e9fc2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '36px', fontSize: '13px', textTransform: 'uppercase' }}
            >
              Envoyer le signalement
            </button>
          </div>
        </div>

        {/* Visible uniquement par l'administrateur */}
        {estAdmin ? (
          <div style={{ borderTop: '2px solid #e1d9d5', paddingTop: '24px' }}>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
              <strong>Espace Modérateur :</strong> Consultez les infractions de la base de données Prisma et appliquez les sanctions.
            </p>

            {chargement && <p style={{ color: '#64748b' }}>Chargement de la file d'attente...</p>}
            {erreur && <p style={{ color: '#b22222', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '4px' }}>⚠️ {erreur}</p>}

            {!chargement && signalements.length === 0 && (
              <div style={{ padding: '30px', textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '6px', color: '#2e8b57', backgroundColor: '#faf8f7', fontWeight: 'bold' }}>
                ✓ Aucun contenu abusif ou signalement en attente de traitement.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {signalements.map((item) => (
                <div key={item.id} style={{ backgroundColor: '#faf8f7', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', backgroundColor: '#fee2e2', color: '#b22222', textTransform: 'uppercase' }}>
                      Motif : {item.categorie}
                    </span>
                    <small style={{ color: '#94a3b8' }}>ID Référence : {item.id}</small>
                  </div>

                  <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#ffffff', borderRadius: '4px', borderLeft: '4px solid #b22222' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Cible détectée par l'algorithme :</p>
                    {item.messageId && <p style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}><strong>Élément :</strong> Message Abusif / Identifiant Personne (ID : <code>{item.messageId}</code>)</p>}
                    {item.publicationId && <p style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}><strong>Élément :</strong> Groupe Signalé / Thématique Illégale (ID : <code>{item.publicationId}</code>)</p>}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => gererResolution(item.id, 'TRAITE')} style={{ padding: '8px 16px', backgroundColor: '#7e9fc2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                      ✓ Valider (Sanctionner)
                    </button>
                    <button onClick={() => gererResolution(item.id, 'REJETE')} style={{ padding: '8px 16px', backgroundColor: '#e1d9d5', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                      ✕ Rejeter l'alerte
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Ce que voit le citoyen ordinaire à la place de la liste */
          <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: '6px', color: '#64748b', backgroundColor: '#faf8f7', fontSize: '13px' }}>
            🔒 Les signalements soumis sont transmis de manière confidentielle à l'équipe de modération de MindHarbor.
          </div>
        )}

      </section>
    </div>
  );
}

export default Admin;
