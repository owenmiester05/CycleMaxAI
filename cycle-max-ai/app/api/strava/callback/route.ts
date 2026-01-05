import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/app/lib/strava';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/?error=strava_auth_failed', request.url));
  }

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
  }

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Strava credentials not configured' }, { status: 500 });
  }

  try {
    const tokenData = await exchangeCodeForToken(code, clientId, clientSecret);

    // Store tokens in cookies (in production, consider more secure storage)
    const cookieStore = await cookies();
    cookieStore.set('strava_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 21600, // 6 hours
    });
    cookieStore.set('strava_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (err) {
    console.error('Error exchanging code for token:', err);
    return NextResponse.redirect(new URL('/?error=strava_token_exchange_failed', request.url));
  }
}