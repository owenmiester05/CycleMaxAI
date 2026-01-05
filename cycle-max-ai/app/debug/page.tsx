'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DebugPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStravaData = async () => {
      try {
        const response = await fetch('/api/strava/activities');
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchStravaData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Strava Debug - Raw Response</h1>
          <div className="text-xl">Loading Strava data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Strava Debug - Raw Response</h1>
          <div className="bg-red-900 border border-red-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-300 mb-2">Error</h2>
            <p className="text-red-200">{error}</p>
          </div>
          <div className="mt-8">
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Strava Debug - Raw Response</h1>
          <div className="flex gap-4">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View Dashboard
            </Link>
            <Link href="/" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Home
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">✅ Success!</h2>
          <p className="text-gray-300 mb-4">
            Here's the raw JSON response from Strava's API. This shows all the activity data available for your account.
          </p>
          <div className="text-sm text-gray-400">
            Activities found: <span className="text-green-400 font-semibold">{data?.activities?.length || 0}</span>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Raw JSON Response</h3>
          </div>
          <div className="p-4">
            <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>

        {data?.activities && data.activities.length > 0 && (
          <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold">Activity Breakdown</h3>
            </div>
            <div className="p-4">
              <div className="grid gap-4">
                {data.activities.slice(0, 5).map((activity: any, index: number) => (
                  <div key={activity.id} className="bg-gray-700 rounded p-4">
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Activity #{index + 1}: {activity.name}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>Distance: {(activity.distance / 1000).toFixed(2)} km</div>
                      <div>Time: {Math.round(activity.moving_time / 60)} min</div>
                      <div>Elevation: {activity.total_elevation_gain} m</div>
                      <div>Avg Speed: {(activity.average_speed * 3.6).toFixed(1)} km/h</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Date: {new Date(activity.start_date).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              {data.activities.length > 5 && (
                <p className="text-gray-400 text-sm mt-4">
                  ... and {data.activities.length - 5} more activities
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}