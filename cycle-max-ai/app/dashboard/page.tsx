'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StravaActivity } from '../lib/strava';

interface AthleteProfile {
  name: string;
  age: number;
  weight: number;
  ftp: number;
  experienceLevel: string;
  trainingGoal: string;
  trainingDaysPerWeek: number;
}

export default function Dashboard() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch activities
        const activitiesResponse = await fetch('/api/strava/activities');
        if (activitiesResponse.ok) {
          const data = await activitiesResponse.json();
          setActivities(data.activities);
        } else {
          setError('Failed to fetch activities');
        }

        // Load profile
        const savedProfile = localStorage.getItem('athleteProfile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        {/* Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Cycling Dashboard
          </h1>
          <div className="flex gap-4">
            <Link
              href="/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {profile ? 'Edit Profile' : 'Setup Profile'}
            </Link>
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Home
            </Link>
          </div>
        </div>

        {/* Profile Summary */}
        {profile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Welcome back, {profile.name}!
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{profile.ftp}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">FTP (watts)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{profile.weight}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Weight (kg)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{profile.trainingDaysPerWeek}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Training Days/Week</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600 capitalize">{profile.experienceLevel}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Experience</p>
              </div>
            </div>
            {profile.trainingGoal && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Goal:</p>
                <p className="text-gray-600 dark:text-gray-400">{profile.trainingGoal}</p>
              </div>
            )}
          </div>
        )}

        {/* Activities */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activities
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.slice(0, 9).map((activity) => (
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

        {/* Next Steps */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Ready for AI-Powered Training?
          </h3>
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            With your profile and activity data, we can generate personalized training plans
            tailored to your goals and current fitness level.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            onClick={() => alert('AI training plan generation coming soon!')}
          >
            Generate Training Plan
          </button>
        </div>
      </div>
    </div>
  );
}