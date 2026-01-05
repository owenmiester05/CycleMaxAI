'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AthleteProfile {
  // Basic Info
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm

  // Cycling Metrics
  ftp: number; // watts
  vo2max?: number;
  restingHR?: number;
  maxHR?: number;

  // Goals & Preferences
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  trainingGoal: string;
  trainingDaysPerWeek: number;
  preferredTrainingTypes: string[];

  // Equipment
  bikeType: string;
  otherEquipment?: string;
}

const defaultProfile: AthleteProfile = {
  name: '',
  age: 25,
  weight: 70,
  height: 175,
  ftp: 200,
  experienceLevel: 'intermediate',
  trainingGoal: '',
  trainingDaysPerWeek: 3,
  preferredTrainingTypes: ['endurance'],
  bikeType: 'road',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<AthleteProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load saved profile from localStorage
    const saved = localStorage.getItem('athleteProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save to localStorage for now
      localStorage.setItem('athleteProfile', JSON.stringify(profile));

      // In the future, this will save to backend
      console.log('Profile saved:', profile);

      // Redirect to dashboard or training plan
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AthleteProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleTrainingTypeChange = (type: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      preferredTrainingTypes: checked
        ? [...prev.preferredTrainingTypes, type]
        : prev.preferredTrainingTypes.filter(t => t !== type)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Athlete Profile Setup
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Tell us about yourself so we can create personalized training plans
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    min="16"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    step="0.1"
                    min="40"
                    max="150"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    min="140"
                    max="220"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Cycling Metrics */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Cycling Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    FTP (Functional Threshold Power in watts)
                  </label>
                  <input
                    type="number"
                    value={profile.ftp}
                    onChange={(e) => handleInputChange('ftp', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    min="100"
                    max="500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your best average power for 1 hour
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    VO2 Max (optional)
                  </label>
                  <input
                    type="number"
                    value={profile.vo2max || ''}
                    onChange={(e) => handleInputChange('vo2max', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    step="0.1"
                    min="30"
                    max="80"
                    placeholder="e.g., 45.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Resting Heart Rate (optional)
                  </label>
                  <input
                    type="number"
                    value={profile.restingHR || ''}
                    onChange={(e) => handleInputChange('restingHR', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    min="40"
                    max="100"
                    placeholder="e.g., 55"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Heart Rate (optional)
                  </label>
                  <input
                    type="number"
                    value={profile.maxHR || ''}
                    onChange={(e) => handleInputChange('maxHR', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    min="150"
                    max="220"
                    placeholder="e.g., 190"
                  />
                </div>
              </div>
            </div>

            {/* Goals & Preferences */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Goals & Training Preferences
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={profile.experienceLevel}
                    onChange={(e) => handleInputChange('experienceLevel', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  >
                    <option value="beginner">Beginner (0-1 years cycling)</option>
                    <option value="intermediate">Intermediate (1-3 years cycling)</option>
                    <option value="advanced">Advanced (3+ years cycling)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Training Goal
                  </label>
                  <textarea
                    value={profile.trainingGoal}
                    onChange={(e) => handleInputChange('trainingGoal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    rows={3}
                    placeholder="e.g., Prepare for my first century ride, improve my FTP by 20 watts, lose 5kg while maintaining fitness..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Training Days Per Week
                  </label>
                  <input
                    type="number"
                    value={profile.trainingDaysPerWeek}
                    onChange={(e) => handleInputChange('trainingDaysPerWeek', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    min="1"
                    max="7"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferred Training Types
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['endurance', 'intervals', 'tempo', 'hill climbing', 'recovery', 'strength'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profile.preferredTrainingTypes.includes(type)}
                          onChange={(e) => handleTrainingTypeChange(type, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {type.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Equipment
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bike Type
                  </label>
                  <select
                    value={profile.bikeType}
                    onChange={(e) => handleInputChange('bikeType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  >
                    <option value="road">Road Bike</option>
                    <option value="mountain">Mountain Bike</option>
                    <option value="hybrid">Hybrid/Commuter</option>
                    <option value="gravel">Gravel Bike</option>
                    <option value="time_trial">Time Trial/Triathlon</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Other Equipment (optional)
                  </label>
                  <textarea
                    value={profile.otherEquipment || ''}
                    onChange={(e) => handleInputChange('otherEquipment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    rows={2}
                    placeholder="Power meter, heart rate monitor, GPS, etc."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving Profile...' : 'Save Profile & Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}