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
            "You are Master T, a stone statue that glazes players with exaggerated praise. 1–2 sentences max. Funny, positive, safe."
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
