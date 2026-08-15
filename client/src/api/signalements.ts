import { api } from './axios';

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

export const signalementsService = {
  creeSignalement: async (payload: any): Promise<any> => {
    const response = await api.post('/signalements', payload);
    return response.data;
  },

  AttenteSignalements: async (): Promise<Signalement[]> => {
    return [
      {
        id: "demo-report-101",
        utilisateurId: "user-xyz",
        categorie: "SPAM",
        statut: "EN_ATTENTE",
        publicationId: "pub-789",
        creeLe: new Date().toISOString(),
        majLe: new Date().toISOString()
      }
    ];
  },

  ModeratationSignalement: async (id: string, statut: 'TRAITE' | 'REJETE'): Promise<{ message: string }> => {
    const response = await api.put(`/signalements/${id}/moderation`, { statut });
    return response.data;
  }
};