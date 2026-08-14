export type VisibiliteGroupe = 'PUBLIC' | 'PRIVE';
export type StatutAdhesion = 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';

export interface GroupCount {
  membres: boolean; // Matches your select: { membres: true } query response shape
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
