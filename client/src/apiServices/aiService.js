const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function askGemini(question) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/chat-bison-001:generateMessage?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: {
          text: question
        }
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    console.error("Gemini API error:", err);
    throw err;
  }

  return res.json();
}
