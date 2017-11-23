export interface Company {
  _id: string;
  name: string;
  symbol: string;
  active: boolean;
  score?: number;
  data?: any[];
}
