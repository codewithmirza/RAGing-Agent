import { NextResponse } from 'next/server';
import { RAGSystem } from '@/lib/rag/ragSystem';

const ragSystem = new RAGSystem();
let isInitialized = false;

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!isInitialized) {
      await ragSystem.initialize();
      isInitialized = true;
    }

    const response = await ragSystem.query(query);
    
    return NextResponse.json({ 
      success: true, 
      response 
    });
    
  } catch (error) {
    console.error('RAG Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process query' 
      },
      { status: 500 }
    );
  }
} 