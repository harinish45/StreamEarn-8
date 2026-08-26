import { NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';

type Message = { role: 'user' | 'assistant' | 'system'; content: string };

function providerConfigured() {
  return Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
}

export async function POST(request: Request) {
  try {
    if (!providerConfigured()) {
      return NextResponse.json({
        error: 'AI provider is not configured on the server. Add GEMINI_API_KEY or GOOGLE_API_KEY to the Render service environment, then redeploy.',
        code: 'AI_PROVIDER_NOT_CONFIGURED'
      }, { status: 503 });
    }

    const body = await request.json() as { messages?: Message[]; mode?: string; pageContext?: string };
    const messages = Array.isArray(body.messages) ? body.messages.slice(-30) : [];
    const latest = messages.filter(m => m.role === 'user').at(-1)?.content?.trim();
    if (!latest) return NextResponse.json({ error: 'Message is required.' }, { status: 400 });

    const mode = body.mode || 'assistant';
    const context = body.pageContext?.slice(0, 30000) || '';
    const system = `You are StreamEarn, a personal AI work assistant. Respond directly and practically. You can plan multi-step work, explain decisions, create checklists, analyze supplied page context, and tell the user exactly what action is needed. Never claim that you browsed, clicked, searched, executed code, accessed an account, or completed an external action unless the request context contains the actual result. If browser access is unavailable, clearly say so and provide the next concrete action. Mode: ${mode}. ${context ? `Current browser page context:\n${context}` : ''}`;
    const transcript = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const result = await ai.generate({ prompt: `${system}\n\nConversation:\n${transcript}\n\nAnswer the latest user request.`, config: { temperature: 0.2 } });
    return NextResponse.json({ answer: result.text });
  } catch (error) {
    console.error('StreamEarn chat error', error);
    return NextResponse.json({ error: 'The AI provider request failed. Check the Render AI provider configuration and server logs.' }, { status: 503 });
  }
}
