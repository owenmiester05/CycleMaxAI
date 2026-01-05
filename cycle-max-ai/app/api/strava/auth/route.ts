import { NextRequest, NextResponse } from 'next/server';
import { getStravaAuthUrl } from '@/app/lib/strava';

export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/strava/callback`;

  if (!clientId) {
    return NextResponse.json({ error: 'Strava client ID not configured' }, { status: 500 });
  }

  const authUrl = getStravaAuthUrl(clientId, redirectUri);
  return NextResponse.redirect(authUrl);
}