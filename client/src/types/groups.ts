export type VisibiliteGroupe = 'PUBLIC' | 'PRIVE';
export type StatutAdhesion = 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';

export interface GroupCount {
  membres: boolean;
}

export interface Group {
  id: string;
  thematique: string;
  description: string;
  regles: string;
  visibilite: VisibiliteGroupe;
  Creele: string;
  majle: string;
  _count: {
    membres: number;
  };
}

export interface DemandeAdhesion {
  id: string;
  groupeId: string;
  utilisateurId: string;
  presentation: string;
  statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';
  creeLe: string;
  majLe: string;
}
