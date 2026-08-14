import api from './axios';
import { Signalement } from '../types/signalements';

export const signalementsService = {
  // Existing method
  createSignalement: async (payload: any): Promise<any> => {
    const response = await api.post('/signalements', payload);
    return response.data;
  },

  // NEW: Fetch all raw pending queue items for the Admin Panel view
  getPendingSignalements: async (): Promise<Signalement[]> => {
    const response = await api.get<Signalement[]>('/signalements/admin/pending');
    return response.data;
  },

  // NEW: Process administrative actions (TRAITE / REJETE)
  moderateSignalement: async (id: string, statut: 'TRAITE' | 'REJETE'): Promise<{ message: string }> => {
    const response = await api.put(`/signalements/${id}/moderation`, { statut });
    return response.data;
  }
};
