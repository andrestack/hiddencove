export async function getInsight(
  question: string,
  context: string
): Promise<{ insight: string; follow_up: string }> {
  const res = await fetch("/api/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, context }),
  })
  if (!res.ok) {
    return { insight: "Unable to fetch insight at the moment.", follow_up: "" }
  }
  const data = await res.json()
  return {
    insight: data.insight || "No insight generated.",
    follow_up: data.follow_up || "",
  }
}
