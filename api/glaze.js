import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ answer: "Use POST" });
  }

  try {
    const { username, question } = req.body || {};
    const name = String(username || "Player").slice(0, 30);
    const q = String(question || "").slice(0, 200);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Master T, a stone statue that glazes players with over-the-top praise. 1–2 sentences max. Funny, positive, safe."
        },
        { role: "user", content: `${name}: ${q}` }
      ],
      max_tokens: 60,
      temperature: 0.9
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() || "You are HIM 🗿🔥";

    return res.status(200).json({ answer });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ answer: "Master T is buffering 💀" });
  }
}
