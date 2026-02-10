'use client';

import { useState } from 'react';

interface UrlInputProps {
    onScrape: (url: string) => Promise<void> | void;
    isLoading: boolean;
}

export default function UrlInput({ onScrape, isLoading }: UrlInputProps) {
    const [url, setUrl] = useState('');
    const [isValid, setIsValid] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url && url.startsWith('http')) {
            setIsValid(true);
            onScrape(url);
        } else {
            setIsValid(false);
        }
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto transform transition-all duration-500 group hover:scale-[1.02]">
            {/* Enhanced Glow Effect */}
            <div className={`absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700 ${isLoading ? 'animate-pulse' : ''}`}></div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {[...Array(6)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 2) * 60}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: '3s'
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/50 leading-none flex items-center justify-between space-x-8">
                <form onSubmit={handleSubmit} className="w-full flex items-center">
                    <div className="flex-1 relative group/input">
                        <div className={`flex items-center px-6 py-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 transition-all duration-500 ${isValid ? 'border-gray-200 hover:border-indigo-200 group-focus-within:border-indigo-500 shadow-sm hover:shadow-md' : 'border-red-300 bg-red-50 shadow-red-100'}`}>
                            <div className="relative mr-4">
                                <svg className={`w-8 h-8 transition-all duration-500 ${isValid ? 'text-gray-400 group-focus-within:text-indigo-500 group-hover:text-indigo-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                {!isValid && (
                                    <div className="absolute -inset-1 bg-red-500/20 rounded-full blur-sm animate-pulse"></div>
                                )}
                            </div>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    setIsValid(true);
                                }}
                                placeholder="Enter website URL to scrape..."
                                className="w-full bg-transparent outline-none text-gray-800 text-xl placeholder-gray-400 font-semibold"
                                disabled={isLoading}
                            />
                            {url && (
                                <div className="flex items-center gap-2 ml-4">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-bold text-green-600">Ready</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !url}
                        className={`ml-6 px-10 py-5 rounded-2xl font-black text-white shadow-2xl transform transition-all duration-300 flex items-center gap-4 group/btn
               ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed scale-95 shadow-inner'
                                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 group-hover:shadow-2xl'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-lg">Processing...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-lg">Scrape Now</span>
                                <svg className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>
            </div>
            
            {!isValid && (
                <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
                    <div className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-200 rounded-full text-red-700 font-bold text-sm animate-pulse">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Please enter a valid URL (starting with http:// or https://)
                    </div>
                </div>
            )}
            
            {/* Success indicator when URL is valid */}
            {url && isValid && !isLoading && (
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </div>
    );
}
