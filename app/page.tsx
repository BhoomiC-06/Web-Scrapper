'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

import UrlInput from '../components/UrlInput';
import ScrapingResults from '../components/ScrapingResults';
import HistoryList from '../components/HistoryList';
import FeatureSection from '../components/FeatureSection';
import Footer from '../components/Footer';
import DataStreamBackground from '../components/DataStreamBackground';

export default function Home() {
  const [url, setUrl] = useState('');
  const [scrapingResult, setScrapingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scrapingHistory, setScrapingHistory] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuthenticated');
    const authToken = localStorage.getItem('authToken');
    const isGuest = localStorage.getItem('isGuest');

    if ((authStatus === 'true' && authToken) || isGuest === 'true') {
      setIsAuthenticated(true);
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [router]);

  const handleScrape = async (e: React.FormEvent, pUrl?: string) => {
    e.preventDefault();
    const targetUrl = pUrl || url;
    if (!targetUrl) return;

    setIsLoading(true);
    try {
      // Call the backend to perform scraping
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }), // Fix: Use targetUrl directly
      });

      const result = await response.json();
      console.log('Scraping result received:', result); // DEBUG Log

      if (response.ok) {
        setScrapingResult(result);
        // Add to history
        const newHistoryItem = {
          id: Date.now(),
          url,
          timestamp: new Date().toISOString(),
          result: result
        };
        setScrapingHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); // Keep last 10 items
      } else {
        console.error('Scraping error response:', result); // DEBUG Log
        setScrapingResult({ error: result.error || 'Scraping failed' });
      }
    } catch (error) {
      console.error('Fetch error:', error); // DEBUG Log
      setScrapingResult({ error: 'An error occurred during scraping' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <DataStreamBackground />
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        {/* Colorful Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px] animate-float" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[100px] animate-float" style={{ animationDuration: '15s', animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/70 border border-white/80 backdrop-blur-xl shadow-xl mb-6 group hover:scale-105 transition-transform duration-500">
            <div className="relative">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
              </span>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 blur-sm animate-pulse"></div>
            </div>
            <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase tracking-widest">
              LIVE • v2.0 Beta
            </span>
          </div>
          
          <div className="relative">
            <h1 className="text-7xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none mb-6">
              <span className="block">Data Cascade</span>
              <span className="relative inline-block mt-4">
                {/* Primary visible text - solid color for guaranteed visibility */}
                <span className="text-6xl md:text-8xl font-black text-indigo-700">Scrape Any Website</span>
                {/* Gradient overlay for visual enhancement */}
                
                {/* Additional fallback */}
                <span className="absolute inset-0 text-6xl md:text-8xl font-black text-indigo-800 opacity-20">Scrape Any Website</span>
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl rounded-full -z-10"></div>
                <svg className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4/5 h-4 text-indigo-300 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 8 50 5 T 100 5" stroke="currentColor" strokeWidth="3" fill="none" className="animate-pulse" />
                </svg>
              </span>
            </h1>
            
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed font-medium mb-8">
              Transform any website into <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">structured data</span>.
              <br />
              <span className="text-gray-600 font-light">No coding required. Just paste a URL and watch the magic happen.</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm font-bold">
              <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full">⚡ Real-time Processing</span>
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full">🤖 AI-Powered</span>
              <span className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full">🔒 Ethical Scraping</span>
            </div>
          </div>
        </div>

        {/* Interaction Zone */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <UrlInput onScrape={(inputUrl: string) => {
            // Wrap handleScrape logic here or modify handleScrape to accept url directly
            // For now we set url state and trigger form submission logic
            setUrl(inputUrl);
            // We need to trigger the actual scrape function, adapting handleScrape to be called directly
            const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
            // Let's refactor handleScrape to take an optional url argument
            handleScrape(fakeEvent, inputUrl);
          }} isLoading={isLoading} />
        </div>

        {/* Commercial Features Section (Only show when no results) */}
        {!scrapingResult && <FeatureSection />}

        {/* Results Section */}
        {scrapingResult && (
          <div className="relative z-10">
            <div className="absolute -inset-4 bg-gradient-to-b from-white/0 to-white/80 z-0 pointer-events-none -mt-32 h-32"></div>
            <ScrapingResults data={scrapingResult} />
          </div>
        )}

        {/* History Section */}
        <HistoryList
          history={scrapingHistory}
          onSelect={(item: any) => {
            setScrapingResult(item.result);
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
        />

        {/* Footer with Review Form */}
        <Footer />
      </div>
    </div>
  );
}