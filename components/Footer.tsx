'use client';

import { useState } from 'react';

export default function Footer() {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, you would send this to the backend
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <footer className="w-full mt-24 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Brand & Copyright */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                                D
                            </div>
                            <span className="text-xl font-bold text-gray-800">Data Cascade</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Empowering developers and businesses with instant, structured web data extraction.
                        </p>
                        <div className="pt-4 text-xs text-gray-400 font-medium">
                            &copy; {new Date().getFullYear()} Data Cascade Inc. All rights reserved.
                        </div>
                    </div>

                    {/* Review Form */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Rate your experience</h3>

                        {submitted ? (
                            <div className="h-48 flex flex-col items-center justify-center text-center text-green-600 space-y-2 animate-fade-in">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-medium">Thank you for your feedback!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Star Rating */}
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <svg
                                                className={`w-8 h-8 transition-colors ${star <= (hoveredRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                                    }`}
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-0 group-focus-within:opacity-25 transition duration-200"></div>
                                        <textarea
                                            required
                                            placeholder="Tell us what you think..."
                                            className="relative w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white transition-colors text-sm min-h-[80px] resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={rating === 0}
                                        className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Submit Review
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
