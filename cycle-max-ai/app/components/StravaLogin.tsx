'use client';

import { useState } from 'react';

export default function StravaLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/strava/callback`;
    const scope = 'read,activity:read_all';

    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    console.log('Full Auth URL:', authUrl);
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
    >
      {isLoading ? 'Connecting...' : 'Connect with Strava'}
    </button>
  );
}