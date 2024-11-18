import { GoogleGenerativeAI } from '@google/generative-ai';

export async function onRequest(context: any) {
  try {
    const url = new URL(context.request.url);
    const path = url.pathname.replace('/api/', '');
    
    if (context.request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const body = await context.request.json();
    const { query } = body;

    if (!query) {
      return new Response('Query is required', { status: 400 });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(context.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Process query
    const prompt = `You are an expert on EU statistics. Please answer this question: ${query}
      
      Format your response with:
      1. A clear headline summary
      2. The main statistic with emoji
      3. Bullet points for additional details
      4. Source attribution (Eurostat, 2024)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ 
      success: true, 
      response: text 
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to process query' 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 