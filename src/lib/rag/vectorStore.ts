import { PineconeClient } from '@pinecone-database/pinecone';

interface PineconeMetadata {
  content: string;
  [key: string]: any;
}

export class EurostatVectorStore {
  private pinecone: PineconeClient;
  private indexName: string;
  private host: string;

  constructor() {
    this.pinecone = new PineconeClient();
    this.indexName = process.env.PINECONE_INDEX || 'raging-agent';
    this.host = process.env.PINECONE_HOST || '';
  }

  async initialize() {
    await this.pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }

  async addDocument(content: string, metadata: Record<string, any>) {
    const embedding = await this.getEmbedding(content);
    const index = this.pinecone.Index(this.indexName);
    
    await index.upsert({
      upsertRequest: {
        vectors: [{
          id: metadata.id || Date.now().toString(),
          values: embedding,
          metadata: {
            ...metadata,
            content
          } as PineconeMetadata
        }],
        namespace: 'eurostat'
      }
    });
  }

  async similaritySearch(query: string, k = 4) {
    const queryEmbedding = await this.getEmbedding(query);
    const index = this.pinecone.Index(this.indexName);
    
    const queryResponse = await index.query({
      queryRequest: {
        topK: k,
        includeMetadata: true,
        vector: queryEmbedding,
        namespace: 'eurostat'
      }
    });

    return (queryResponse.matches || []).map(match => ({
      pageContent: (match.metadata as PineconeMetadata)?.content || '',
      metadata: match.metadata || {}
    }));
  }

  private async getEmbedding(text: string) {
    const words = text.toLowerCase().split(/\W+/);
    const vector = new Array(1536).fill(0);
    
    words.forEach((word, i) => {
      const position = Math.abs(word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 1536;
      vector[position] = 1;
    });
    
    return vector;
  }
} 