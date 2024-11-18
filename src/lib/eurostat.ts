// Simple in-memory cache for demo purposes
const cache: Record<string, any> = {};

export async function queryEurostat(query: string) {
  // Cache check
  if (cache[query]) return cache[query];

  // Demo dataset - we'll pretend this is from Eurostat
  const demoData = {
    "GDP growth": "2.3% average across EU in 2023",
    "unemployment": "6.5% EU average for 2023",
    "inflation": "3.2% annual rate in December 2023",
    // Add more demo data here
  };

  // Simple keyword matching
  const response = Object.entries(demoData)
    .filter(([key]) => 
      query.toLowerCase().includes(key.toLowerCase()))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  // Cache the result
  cache[query] = response || "I don't have specific data for that query. Try asking about GDP, unemployment, or inflation.";
  
  return cache[query];
} 