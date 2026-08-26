import { NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';

type Message = { role: 'user' | 'assistant' | 'system'; content: string };

export async function POST(request: Request) {
  try {
    const body = await request.json() as { messages?: Message[]; mode?: string; pageContext?: string };
    const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
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
    return NextResponse.json({ error: 'AI service is unavailable. Check the configured AI provider credentials on Render.' }, { status: 503 });
  }
}
