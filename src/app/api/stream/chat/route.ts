import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CHAT_MESSAGES } from '@/lib/stream/mock-data';
import { ChatService } from '@/lib/stream/chat-service';

export async function GET() {
  return NextResponse.json(INITIAL_CHAT_MESSAGES, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, text } = body;

    if (!user || !user.name) {
      return NextResponse.json({ error: 'User profile is required' }, { status: 400 });
    }

    const message = ChatService.createChatMessage(user, text);
    return NextResponse.json(message, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid chat message';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
