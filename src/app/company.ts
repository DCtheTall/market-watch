import { ChartNode } from './chart-node';

export interface Company {
  _id: string;
  name: string;
  symbol: string;
  active: boolean;
  searchRelevancy?: number;
  data: ChartNode[];
  color?: string;
}
