import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';
import { rejectCrossOrigin } from '@/lib/security';
export const runtime='nodejs';
export async function POST(request:NextRequest){const blocked=rejectCrossOrigin(request);if(blocked)return blocked;const response=NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});response.headers.set('Set-Cookie',clearSessionCookie());return response;}
