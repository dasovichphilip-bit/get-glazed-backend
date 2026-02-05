import OpenAI from "openai";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method !== "POST") {
      return res.status(405).end(JSON.stringify({ answer: "Use POST" }));
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(500).end(
        JSON.stringify({
          answer: "Server missing key",
          error: "OPENAI_API_KEY is missing in Vercel env vars (add it + redeploy)"
        })
      );
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const username = String(body.username || "Player").slice(0, 30);
    const question = String(body.question || "").slice(0, 200);

    const systemPrompt =
      "You are a mysterious stone statue NPC in a Roblox game.\n" +
      "Personality:\n" +
      "- Calm, slightly funny, slightly sarcastic.\n" +
      "- Helpful or entertaining answers.\n" +
      "- Only a small amount of glazing.\n" +
      "- Never over-the-top hype.\n\n" +
      "Identity rule:\n" +
      '- If asked who you are / name / what you are: reply exactly \"Tung Tung Tung Sahur\".\n' +
      "- Otherwise do NOT mention that name.\n\n" +
      "Style:\n" +
      "- 1-2 sentences max. Short. One emoji max. No AI/OpenAI mentions.\n" +
      "Safety:\n" +
      "- Refuse unsafe requests briefly, stay in character.\n";

    const client = new OpenAI({ apiKey: key });

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: systemPrompt + "\n" + username + ": " + question
    });

    const answer = (response.output_text || "...").trim();
    return res.status(200).end(JSON.stringify({ answer }));
  } catch (err) {
    console.error("GLAZE FUNCTION ERROR:", err);
    return res.status(500).end(
      JSON.stringify({
        answer: "Master T is buffering",
        error: String((err && err.message) || err)
      })
    );
  }
}

