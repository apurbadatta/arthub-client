import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages, userContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Fetch live artworks catalog for real recommendations
    let artworksCatalog = [];
    try {
      const serverUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const artRes = await fetch(`${serverUrl}/api/artworks`, { cache: "no-store" });
      if (artRes.ok) {
        const artData = await artRes.json();
        artworksCatalog = artData.data || [];
      }
    } catch (e) {
      console.warn("Could not fetch artworks catalog for ArtBot:", e.message);
    }

    const catalogSummary = artworksCatalog.slice(0, 10).map((art) => ({
      id: art._id,
      title: art.title,
      artist: art.artistName || "Independent Artist",
      price: art.price,
      category: art.category,
      image: art.image,
      description: art.description?.slice(0, 100),
    }));

    const systemPrompt = `You are "ArtBot" 🎨 — an elite, sophisticated, and friendly AI Art Curator for ArtHub.
ArtHub is a premier online art marketplace featuring original handmade paintings, digital masterpieces, and sculptures from independent artists worldwide.

Your role:
1. Help users discover artworks that match their style, room decor, color palette, or budget.
2. Answer questions about art styles (Impressionism, Minimalism, Abstract, Cubism, Surrealism), color psychology, home interior styling, and art collecting.
3. Recommend specific paintings from the ArtHub catalog when relevant.
4. Always speak with passion, aesthetic elegance, clarity, and warmth. Use emojis tastefully.

Current Featured Artworks in Catalog:
${JSON.stringify(catalogSummary, null, 2)}

Instructions:
- If recommending artworks, mention their title, price, artist, and why they fit the user's request.
- Keep responses concise, engaging, and well-structured with bullet points or short paragraphs.`;

    if (apiKey) {
      try {
        const formattedContents = [
          { parts: [{ text: systemPrompt }] },
          ...messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
          })),
        ];

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: formattedContents }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            // Find recommended artworks in catalog
            const recommendedArts = catalogSummary.filter((art) =>
              reply.toLowerCase().includes(art.title.toLowerCase())
            );

            return NextResponse.json({
              success: true,
              reply,
              recommendations: recommendedArts.slice(0, 3),
            });
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini chat error, fallback to curated response:", geminiErr);
      }
    }

    // Heuristic intelligent art curation fallback
    const query = lastUserMessage.toLowerCase();
    let reply = "";
    let recommendedArts = [];

    if (query.includes("recommend") || query.includes("suggest") || query.includes("looking for") || query.includes("buy")) {
      if (query.includes("under") || query.includes("budget") || query.includes("cheap") || query.includes("affordable")) {
        const affordable = catalogSummary.filter((a) => a.price <= 200);
        recommendedArts = affordable.length > 0 ? affordable.slice(0, 3) : catalogSummary.slice(0, 2);
        reply = `✨ Here are fantastic budget-friendly original pieces curated just for you under our accessible collection! Each artwork is verified authentic and directly supports the creator.`;
      } else if (query.includes("abstract") || query.includes("modern")) {
        recommendedArts = catalogSummary.filter((a) => (a.category === "Digital" || a.title.toLowerCase().includes("horizon") || a.title.toLowerCase().includes("light"))).slice(0, 3);
        if (recommendedArts.length === 0) recommendedArts = catalogSummary.slice(0, 2);
        reply = `🎨 For a modern and abstract ambiance, bold color contrasts and dynamic compositions create an unforgettable focal point in your space. Here are curated pieces matching that aesthetic:`;
      } else {
        recommendedArts = catalogSummary.slice(0, 3);
        reply = `🌟 Welcome to ArtHub! Based on your artistic taste, I've curated these standout original artworks currently trending in our gallery:`;
      }
    } else if (query.includes("room") || query.includes("living") || query.includes("bedroom") || query.includes("wall") || query.includes("decor")) {
      recommendedArts = catalogSummary.slice(0, 2);
      reply = `🏡 **Art & Interior Styling Tip**: For living rooms, large horizontal paintings with warm or balanced cool tones create harmony and anchor the room. For bedrooms, serene palettes like sage green, soft lavender, or deep ocean blues foster relaxation.\n\nTake a look at these pieces that would transform your wall:`;
    } else if (query.includes("hi") || query.includes("hello") || query.includes("hey")) {
      reply = `👋 Hello art lover! I'm **ArtBot**, your personal ArtHub curator. How can I inspire your gallery journey today?\n\n- Looking for artwork for a specific room or color palette?\n- Need recommendations within a budget?\n- Curious about different art styles? Just let me know!`;
    } else {
      recommendedArts = catalogSummary.slice(0, 2);
      reply = `🎨 That is a wonderful artistic preference! Art has the unique power to evoke emotion and elevate our everyday spaces. Here are handpicked selections from our verified creators that resonate with that spirit:`;
    }

    return NextResponse.json({
      success: true,
      reply,
      recommendations: recommendedArts,
    });
  } catch (error) {
    console.error("Curator chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate curator response" },
      { status: 500 }
    );
  }
}
