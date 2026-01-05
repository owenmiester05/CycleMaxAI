'use client';

import { useEffect, useState } from 'react';
import { StravaActivity } from '../lib/strava';

export default function Dashboard() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/strava/activities');
        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities);
        } else {
          setError('Failed to fetch activities');
        }
      } catch (err) {
        setError('Error fetching activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your cycling data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error}</p>
          <a href="/" className="text-blue-500 hover:underline">Go back</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Your Cycling Dashboard
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activities.slice(0, 10).map((activity) => (
            <div key={activity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {activity.name}
              </h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <p>Distance: {(activity.distance / 1000).toFixed(2)} km</p>
                <p>Time: {Math.round(activity.moving_time / 60)} minutes</p>
                <p>Elevation: {activity.total_elevation_gain} m</p>
                <p>Avg Speed: {(activity.average_speed * 3.6).toFixed(1)} km/h</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(activity.start_date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No activities found. Make sure your Strava account has cycling data.
          </p>
        )}
      </div>
    </div>
  );
}