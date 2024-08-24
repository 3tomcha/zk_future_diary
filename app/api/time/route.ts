// app/api/time/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const currentTime = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  return NextResponse.json({ currentTime });
}
