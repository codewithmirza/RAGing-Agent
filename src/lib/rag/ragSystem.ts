import { GoogleGenerativeAI } from '@google/generative-ai';
import { queryEurostat } from '@/lib/eurostat';

export class RAGSystem {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async initialize() {
    // Nothing to initialize
    return;
  }

  async query(userQuery: string): Promise<string> {
    try {
      const prompt = `You are an expert on EU statistics. Please answer this question: ${userQuery}
        
        Format your response with:
        1. A clear headline summary
        2. The main statistic with emoji
        3. Bullet points for additional details
        4. Source attribution (Eurostat, 2024)`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return queryEurostat(userQuery);
    }
  }
} 