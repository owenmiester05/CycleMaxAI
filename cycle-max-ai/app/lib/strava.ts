import axios from 'axios';

const STRAVA_BASE_URL = 'https://www.strava.com/api/v3';

export interface StravaToken {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  average_speed: number;
  max_speed: number;
  // Add more fields as needed
}

export const getStravaAuthUrl = (clientId: string, redirectUri: string) => {
  const scope = 'read,activity:read_all';
  return `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
};

export const exchangeCodeForToken = async (
  code: string,
  clientId: string,
  clientSecret: string
): Promise<StravaToken> => {
  const response = await axios.post('https://www.strava.com/oauth/token', {
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
  });
  return response.data;
};

export const refreshAccessToken = async (
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<StravaToken> => {
  const response = await axios.post('https://www.strava.com/oauth/token', {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  return response.data;
};

export const getAthleteActivities = async (
  accessToken: string,
  page = 1,
  perPage = 30
): Promise<StravaActivity[]> => {
  const response = await axios.get(`${STRAVA_BASE_URL}/athlete/activities`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      page,
      per_page: perPage,
    },
  });
  return response.data;
};