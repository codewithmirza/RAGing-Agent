export interface EurostatDataset {
  id: string;
  title: string;
  description: string;
  data: any;
  metadata: {
    lastUpdate: string;
    unit?: string;
    source: string;
    flags?: string[];
  };
}

export interface VectorStore {
  id: string;
  vector: number[];
  content: string;
  metadata: Record<string, any>;
} 