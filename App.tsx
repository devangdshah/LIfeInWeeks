import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { Dashboard } from './components/Dashboard';
import { UserData, LifeExpectancyResult, ViewMode } from './types';
import { calculateLifeExpectancy } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.ONBOARDING);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [result, setResult] = useState<LifeExpectancyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserData) => {
    setIsLoading(true);
    setError(null);
    try {
      setUserData(data);
      const lifeResult = await calculateLifeExpectancy(data);
      setResult(lifeResult);
      setView(ViewMode.DASHBOARD);
    } catch (err) {
      setError("An error occurred while calculating. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setView(ViewMode.ONBOARDING);
    setUserData(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-paper-50 flex flex-col items-center justify-center p-4 selection:bg-black selection:text-white overflow-x-hidden font-sans">
      {/* Subtle Grain Texture Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 w-full">
        {error && (
          <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm" role="alert">
            <span className="block sm:inline flex items-center gap-2 font-medium">
              <span className="text-xl">⚠️</span> {error}
            </span>
          </div>
        )}

        {view === ViewMode.ONBOARDING && (
          <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        )}

        {view === ViewMode.DASHBOARD && userData && result && (
          <Dashboard data={result} userData={userData} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

export default App;