'use client';

import { useEffect, useState } from 'react';

const SNIPPETS = [
    'GET /api/v2.0/scrape', '200 OK', '{ "data": "extracted" }', '<html><body>...</body>',
    'Content-Type: application/json', 'import "scrapeflow"', '<meta name="description">',
    'Analyzing DOM...', 'Extracting images...', 'Parsing headers...',
    'https://www.google.com', 'https://www.amazon.com', 'https://www.flipkart.com',
    'https://www.netflix.com', 'https://www.reddit.com/r/data',
    'Starting headless browser...', 'Rendering JS...',
    'Found 42 links', 'Status: Success', 'Token: eyJhbGciOi...'
];

export default function DataStreamBackground() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        // Initial population
        const initialItems = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
            x: Math.random() * 100, // %
            y: Math.random() * 100, // %
            duration: 20 + Math.random() * 10, // s
            delay: Math.random() * -30, // s
            opacity: 0.1 + Math.random() * 0.2, // Reduced opacity (0.1 to 0.3)
            size: 14 + Math.random() * 10,
            color: Math.random() > 0.5 ? 'text-slate-400' : 'text-indigo-400' // Lighter text colors
        }));
        setItems(initialItems);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-[-5]">
            {/* Base Gradient - Lighter/Softer */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/50 to-slate-100 opacity-90"></div>

            {/* Animated Stream Items */}
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`absolute font-mono font-bold whitespace-nowrap animate-float-up ${item.color}`}
                    style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        fontSize: `${item.size}px`,
                        opacity: item.opacity,
                        animationDuration: `${item.duration}s`,
                        animationDelay: `${item.delay}s`,
                    }}
                >
                    {item.text}
                </div>
            ))}

            {/* Connection Lines (Simulated Grid) */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.05] z-[-1]">
                <defs>
                    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1e293b" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
    );
}
