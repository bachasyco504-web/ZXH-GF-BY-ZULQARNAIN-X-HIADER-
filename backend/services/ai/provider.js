export async function generateReply({ system, messages }) {
  const { AI_BASE_URL, AI_API_KEY, AI_MODEL } = process.env;
  if (!AI_BASE_URL || !AI_API_KEY || !AI_MODEL) {
    return "AI provider is not configured yet. Add AI_BASE_URL, AI_API_KEY and AI_MODEL on the server.";
  }
  const response = await fetch(`${AI_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${AI_API_KEY}` },
    body: JSON.stringify({ model: AI_MODEL, messages: [{ role: "system", content: system }, ...messages], temperature: 0.8 })
  });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I couldn't generate a response.";
}