import api from './axios';
import { Group } from '../types/groups';

export const groupsService = {
  fetchGroups: async (recherche?: string): Promise<Group[]> => {
    const response = await api.get<Group[]>('/groupes', {
      params: recherche ? { recherche } : {}
    });
    return response.data;
  },

  // Calls router.post('/:groupeId/rejoindre')
  joinGroup: async (groupeId: string, presentation?: string): Promise<any> => {
    const response = await api.post(`/groupes/${groupeId}/rejoindre`, {
      presentation
    });
    return response.data;
  }
};
