import { RAGSystem } from '@/lib/rag/ragSystem';

const ragSystem = new RAGSystem();

export async function POST(request: Request) {
  const { query } = await request.json();
  
  try {
    const response = await ragSystem.query(query);
    return new Response(JSON.stringify({ response }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process query' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 