// api/glaze.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ answer: "Use POST" });
  }

  try {
    // Make sure the key exists on Vercel
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing (check Vercel Environment Variables + redeploy)");
    }

    const { username, question } = req.body || {};
    const name = String(username || "Player").slice(0, 30);
    const q = String(question || "").slice(0, 200);

    const systemPrompt = `You are a mysterious stone statue NPC in a Roblox game.

Personality:
- Calm, slightly funny, slightly sarcastic.
- Helpful or entertaining answers.
- Only a small amount of glazing (light praise occasionally).
- Never over-the-top hype.
- Consistent character voice.

Identity rule:
- If someone asks who you are, what your name is, or what you are: reply exactly "Tung Tung Tung Sahur".
- Otherwise do NOT mention that name.

Style:
- 1–2 sentences max.
- Short, confident responses.
- One emoji max occasionally.
- Do not mention being an AI or OpenAI.
- Do not ask follow-up questions.

Safety:
- No sexual content, hate, or encouragement of real-world harm/illegal acts.
- If unsafe: refuse briefly, stay in character.`;

    // ✅ Responses API: use ONE string input (most reliable)
    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `${systemPrompt}\n\n${name}: ${q}`,
    });

    const answer = response.output_text?.trim() || "…";
    return res.status(200).json({ answer });
  } catch (err) {
    console.error("BACKEND ERROR:", err);

    // Return a useful error string for debugging
    return res.status(500).json({
      answer: "Master T is buffering 💀",
      error: String(err?.message || err),
    });
  }
}

}
