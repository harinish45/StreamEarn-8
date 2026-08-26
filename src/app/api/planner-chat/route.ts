import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = String(body?.message ?? '').trim();
    const context = body?.context ?? {};
    if (!message) return NextResponse.json({ error: 'Message is required.' }, { status: 400 });

    const key = process.env.GOOGLE_GENAI_API_KEY;
    if (!key) {
      return NextResponse.json({
        error: 'Xara AI is not configured on this deployment. Set GOOGLE_GENAI_API_KEY in Render environment variables. The rest of Planner works without it.',
      }, { status: 503 });
    }

    const system = `You are Xara, a precise personal planning assistant inside StreamEarn. Act on the user's planner context and return concise useful text. You may suggest task breakdowns, schedules, priorities, meeting action items, notes and project plans. Never invent facts from the private context. Do not claim database changes were made because this endpoint does not mutate storage. Return plain text with compact bullets when useful. Current context: ${JSON.stringify(context).slice(0, 12000)}`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 900 },
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json({ error: `Xara AI request failed (${response.status}).`, detail: detail.slice(0, 300) }, { status: 502 });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('').trim();
    if (!reply) return NextResponse.json({ error: 'Xara returned no usable response.' }, { status: 502 });
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: 'Unable to process the Xara AI request.' }, { status: 500 });
  }
}
