import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, verifySession } from '@/lib/auth';
import { listProjects } from '@/lib/project-store';
export const runtime='nodejs';
export async function GET(){const session=verifySession((await cookies()).get(AUTH_COOKIE)?.value);if(!session)return NextResponse.json({error:'Unauthorized'},{status:401,headers:{'Cache-Control':'no-store'}});try{const projects=await listProjects();return new NextResponse(JSON.stringify({version:1,exportedAt:new Date().toISOString(),projects},null,2),{status:200,headers:{'Content-Type':'application/json; charset=utf-8','Content-Disposition':'attachment; filename="streamearn-project-backup.json"','Cache-Control':'private, no-store'}})}catch{return NextResponse.json({error:'Unable to create backup'},{status:500,headers:{'Cache-Control':'no-store'}})}}
