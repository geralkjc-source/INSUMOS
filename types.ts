
export interface PlantData {
  initial: number;
  abastecimento: number;
  c1: number;
  c2: number;
  magnetitePit: number;
}

export interface FlocculantData {
  initialCount: number;
  initialWeight: number;
  consumido: number;
  abastecimento: number;
}

export interface ReagentTank {
  id: string;
  initial: number;
  final: number;
}

export interface MagnetiteJustification {
  c1: string;
  c2: string;
  d1: string;
  d2: string;
}

export interface Report {
  id: string;
  turma: string;
  operador: string;
  data: string;
  turno: string;
  plantaC: PlantData;
  plantaD: PlantData;
  flocculante: FlocculantData;
  reagentes: ReagentTank[];
  magnetiteJustification: MagnetiteJustification;
}

export interface Thresholds {
  plantaC: number;
  plantaD: number;
  flocculante: number;
  reagentes: Record<string, number>;
}

export type AppView = 'dashboard' | 'new-report' | 'history' | 'settings';
