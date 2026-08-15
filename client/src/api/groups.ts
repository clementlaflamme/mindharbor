import { api } from './axios';
// import { Group } from '../types/groups';

export interface GroupCount {
  membres: number;
}

export interface Group {
  id: string;
  thematique: string;
  description: string;
  regles: string;
  visibilite: 'PUBLIC' | 'PRIVE';
  Creele: string;
  majle: string;
  _count: GroupCount;
}

export const groupsService = {
  recupererGroups: async (recherche?: string): Promise<Group[]> => {
    const response = await api.get<Group[]>('/groupes', {
      params: recherche ? { recherche } : {}
    });
    return response.data;
  },

  joindreGroup: async (groupeId: string, presentation?: string): Promise<any> => {
    const response = await api.post(`/groupes/${groupeId}/rejoindre`, {
      presentation
    });
    return response.data;
  }
};
