import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, description, category, price, artistName, tone = "poetic" } =
      await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Artwork title is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const systemPrompt = `You are a world-class social media strategist and art marketing copywriter.
Generate an engaging Social Media Marketing Kit for an original artwork on ArtHub with the following details:
- Title: "${title}"
- Description: "${description || "Original artwork"}"
- Category: "${category || "Fine Art"}"
- Price: "$${price || "Inquire"}"
- Artist: "${artistName || "Independent Artist"}"
- Tone: "${tone}" (options: poetic, energetic, luxury, minimalist)

Return a JSON object ONLY with the following exact keys:
1. "instagram": {
     "caption": "A compelling Instagram caption with emojis and hook",
     "hashtags": ["#ArtHub", "#OriginalArt", "#ArtCollector", ... 10-15 trending art hashtags]
   }
2. "twitter": {
     "tweet1": "Hook tweet introducing the piece with evocative storytelling",
     "tweet2": "Follow-up tweet highlighting the technique, medium, and inspiration",
     "tweet3": "Call-to-action tweet with pricing and collection link"
   }
3. "facebook": {
     "post": "A rich, story-driven Facebook/LinkedIn post celebrating the creation process and inviting art lovers to connect."
   }
4. "collectorEmail": {
     "subject": "Exclusive Acquisition Opportunity: [Artwork Title]",
     "body": "A polished, elegant email pitch for private collectors highlighting the emotional and aesthetic value of this piece."
   }

Return ONLY pure valid JSON, no markdown codeblocks, no extra explanation.`;

    if (apiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleaned);
            return NextResponse.json({ success: true, data: parsed });
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini marketing kit error, fallback to template generator:", geminiErr);
      }
    }

    // High quality intelligent template generator fallback
    const hashtags = [
      "#ArtHub",
      "#ContemporaryArt",
      `#${category?.replace(/\s+/g, "") || "Painting"}`,
      "#ArtCollector",
      "#OriginalArtwork",
      "#VisualArt",
      "#ArtistOnInstagram",
      "#InteriorArt",
      "#ArtOfTheDay",
      "#CreativeProcess",
      "#ModernArtGallery",
      "#FineArtConnoisseur",
    ];

    const kit = {
      instagram: {
        caption: `✨ "${title}" ✨\n\n"${description || "Every brushstroke tells a story of emotion, light, and boundless imagination."}"\n\n🖌️ Medium: ${category || "Original Painting"}\n💎 Price: $${price || "250"}\n👨‍🎨 Created by: ${artistName || "Independent Artist"}\n\nAvailable exclusively on @ArtHub. Link in bio to claim this one-of-a-kind original piece for your collection! 🖼️🕊️`,
        hashtags: hashtags,
      },
      twitter: {
        tweet1: `1/3 🎨 Excited to present "${title}" — an exploration of light, mood, and raw artistic emotion. Available now on @ArtHub 🧵👇`,
        tweet2: `2/3 🖌️ In this piece, every layer was crafted to capture a sense of timeless tranquility and depth. Whether as a focal point in your home or gallery, it breathes life into any room.`,
        tweet3: `3/3 🔗 Discover and acquire the original work for $${price || "250"} on ArtHub: Secure checkout & verified authenticity. Own the original today! ✨`,
      },
      facebook: {
        post: `🎨 NEW ARTWORK RELEASE: "${title}"\n\nWe are thrilled to unveil this breathtaking new creation by ${artistName || "our featured artist"}. "${description || "A masterpiece that speaks to the soul through rich harmony and expressive texture."}"\n\n🏷️ Category: ${category || "Original Art"}\n💰 Investment: $${price || "250"}\n\nOwn an authentic original that transforms your space. Explore the full details and acquire securely on ArtHub today.`,
      },
      collectorEmail: {
        subject: `Exclusive Collector Spotlight: "${title}" by ${artistName || "Featured Artist"}`,
        body: `Dear Art Enthusiast,\n\nWe are pleased to introduce a standout new addition to our curated catalog: "${title}".\n\nThis piece presents a masterclass in ${category || "visual art"}, combining delicate tonal mastery with powerful presence. At $${price || "250"}, it represents exceptional value for discerning collectors seeking authentic original works.\n\nView complete high-resolution details and private collector acquisition terms on ArtHub today.\n\nWarm regards,\nThe ArtHub Curation Team`,
      },
    };

    return NextResponse.json({ success: true, data: kit, isFallback: !apiKey });
  } catch (error) {
    console.error("Marketing kit error:", error);
    return NextResponse.json(
      { error: "Failed to generate marketing kit" },
      { status: 500 }
    );
  }
}
