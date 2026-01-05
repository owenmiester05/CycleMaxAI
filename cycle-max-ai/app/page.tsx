import StravaLogin from './components/StravaLogin';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            CycleMax AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Unlock your cycling potential with AI-powered insights from your Strava data.
            Analyze your rides, get personalized recommendations, and reach new heights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <StravaLogin />
            <Link
              href="/profile"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Setup Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
