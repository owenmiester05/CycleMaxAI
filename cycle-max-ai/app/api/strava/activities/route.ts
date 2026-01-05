import { NextRequest, NextResponse } from 'next/server';
import { getAthleteActivities, refreshAccessToken } from '@/app/lib/strava';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('strava_access_token')?.value;
  const refreshToken = cookieStore.get('strava_refresh_token')?.value;

  if (!accessToken && refreshToken) {
    // Try to refresh the token
    const clientId = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;

    if (clientId && clientSecret) {
      try {
        const tokenData = await refreshAccessToken(refreshToken, clientId, clientSecret);
        accessToken = tokenData.access_token;
        cookieStore.set('strava_access_token', tokenData.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 21600,
        });
      } catch (err) {
        console.error('Error refreshing token:', err);
        return NextResponse.json({ error: 'Failed to refresh access token' }, { status: 401 });
      }
    }
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'No access token available' }, { status: 401 });
  }

  try {
    const activities = await getAthleteActivities(accessToken);
    return NextResponse.json({ activities });
  } catch (err) {
    console.error('Error fetching activities:', err);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}