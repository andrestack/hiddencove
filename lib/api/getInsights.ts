// lib/api/getInsight.ts
export async function getInsight(question: string, context: string): Promise<string> {
    const res = await fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context }),
    });
    if (!res.ok) {
      return "Unable to fetch insight at the moment.";
    }
    const data = await res.json();
    return data.insight || "No insight generated.";
  }