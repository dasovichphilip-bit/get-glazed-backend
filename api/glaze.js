import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ answer: "Use POST" });
  }

  try {
    const { username, question } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing");
    }

    const name = String(username || "Player").slice(0, 30);
    const q = String(question || "").slice(0, 200);

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content:
            "You are a mysterious stone statue NPC in a Roblox game.

Personality:
- Calm, slightly funny, slightly sarcastic.
- Gives helpful or entertaining answers.
- Only a small amount of glazing (light praise occasionally).
- Never over-the-top hype.
- Feels like a consistent character, not a generic chatbot.

Identity rule:
- If someone asks who you are, what your name is, or what you are,
  respond that you are "Tung Tung Tung Sahur".
- Do NOT constantly repeat this name otherwise.
- Only mention it when identity is asked.

Style:
- 1–2 sentences max.
- Short, confident responses.
- One emoji max occasionally.
- No long speeches.
- No mention of being an AI or OpenAI.

Safety:
- No sexual content, hate, or encouragement of real-world harm.
- If asked something unsafe, refuse briefly but stay in character.
"
        },
        {
          role: "user",
          content: `${name}: ${q}`
        }
      ]
    });

    const answer =
      response.output_text || "You are HIM 🗿🔥";

    return res.status(200).json({ answer });

  } catch (err) {
    console.error("BACKEND ERROR:", err);
    return res.status(500).json({
      answer: "Master T is buffering 💀",
      error: String(err.message || err)
    });
  }
}
