// Simple in-memory cache for demo purposes
const cache: Record<string, any> = {};

const demoData = {
  "GDP growth": {
    value: "2.3% average across EU in 2023",
    details: [
      "France: 2.1%",
      "Germany: 1.9%",
      "Italy: 2.4%",
      "Spain: 2.7%"
    ]
  },
  "unemployment": {
    value: "6.5% EU average for 2023",
    details: [
      "Youth unemployment: 14.8%",
      "Long-term unemployment: 2.8%",
      "Female unemployment: 6.7%",
      "Male unemployment: 6.3%"
    ]
  },
  "inflation": {
    value: "3.2% annual rate in December 2023",
    details: [
      "Core inflation: 2.8%",
      "Food inflation: 4.1%",
      "Energy inflation: 1.8%",
      "Services inflation: 3.5%"
    ]
  },
  "population": {
    value: "447.7 million (2023 estimate)",
    details: [
      "Urban population: 75%",
      "Rural population: 25%",
      "Median age: 43.7 years",
      "Population growth: 0.1%"
    ]
  },
  "trade": {
    value: "€4.8 trillion in total trade volume (2023)",
    details: [
      "Exports: €2.5 trillion",
      "Imports: €2.3 trillion",
      "Trade surplus: €200 billion",
      "Main partner: United States (18%)"
    ]
  }
};

export async function queryEurostat(query: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Cache check
  if (cache[query]) return cache[query];

  // Process query
  const queryLower = query.toLowerCase();
  let response = '';

  // Find matching topics
  const matches = Object.entries(demoData)
    .filter(([key]) => 
      queryLower.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(queryLower)
    );

  if (matches.length > 0) {
    response = matches.map(([key, data]) => {
      return `📊 ${key}:\n${data.value}\n\nDetailed breakdown:\n${data.details.map(detail => `• ${detail}`).join('\n')}`;
    }).join('\n\n');
  } else {
    response = `I don't have specific data for that query. Try asking about:\n${Object.keys(demoData).map(key => `• ${key}`).join('\n')}`;
  }

  // Cache the result
  cache[query] = response;
  
  return response;
}

// Add some example queries for testing
export const exampleQueries = [
  "What's the current GDP growth in the EU?",
  "Tell me about unemployment rates",
  "How is inflation affecting the EU?",
  "What's the population of the EU?",
  "Show me trade statistics"
]; 