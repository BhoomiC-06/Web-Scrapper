'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userEmail = localStorage.getItem('userEmail');

    if (authStatus === 'true' && userEmail) {
      setIsAuthenticated(true);
      setUserEmail(userEmail);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      setIsAuthenticated(false);
      setUserEmail('');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Don't show navigation on login page
  if (pathname === '/login') return null;

  return (
    <nav className="fixed w-full z-50 transition-all duration-500 bg-white/90 backdrop-blur-xl border-b border-white/30 shadow-lg hover:shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-2xl shadow-2xl group-hover:scale-110 transition-all duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <span className="relative z-10">D</span>
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-indigo-400 to-pink-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-700 to-purple-800 group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-500">
                  Data Cascade
                </span>
                <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity">
                  SCRAPE • EXTRACT • ANALYZE
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex flex-col items-end group cursor-pointer">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-widest group-hover:text-indigo-500 transition-colors">
                    Logged in as
                  </span>
                  <span className="text-sm font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                    {userEmail}
                  </span>
                  <div className="w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300 mt-1"></div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-6 py-3 border-2 border-red-500/30 text-sm font-bold rounded-2xl text-red-600 bg-red-50/50 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/30 group"
                >
                  <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <span className="group-hover:underline decoration-indigo-500 decoration-2 underline-offset-4">Sign in</span>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-8 py-3 border-2 border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 hover:scale-105 transition-all duration-300 group"
                >
                  <span>Get Started</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}