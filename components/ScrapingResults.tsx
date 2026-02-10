'use client';

interface ScrapingResultsProps {
    data: any;
}

import { useState } from 'react';

export default function ScrapingResults({ data }: ScrapingResultsProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [copyStatus, setCopyStatus] = useState<string | null>(null);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopyStatus(label);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    const downloadJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `scrapeflow_${Date.now()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    if (!data) {
        console.log('ScrapingResults: No data received');
        return null;
    }
    console.log('ScrapingResults: Rendering with data', data);

    if (data.error) {
        return (
            <div className="w-full animate-fade-in">
                <div className="p-6 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-2xl flex items-center gap-4 text-red-700 shadow-lg">
                    <div className="p-3 bg-red-100 rounded-full shrink-0">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Scraping Failed</h3>
                        <p className="text-sm opacity-90">{data.error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full animate-fade-in">
            <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-white/50">

                {/* Header / Tabs */}
                <div className="bg-white/50 backdrop-blur-sm border-b border-gray-100 p-4 flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex bg-gray-100/80 p-1 rounded-xl">
                        {['overview', 'content', 'images', 'json'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab
                                    ? 'bg-white text-indigo-600 shadow-sm scale-105'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={downloadJson}
                            className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download JSON
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 min-h-[400px]">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Quick Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-center hover:scale-105 transition-transform">
                                    <div className="text-2xl font-bold text-indigo-600">{data.links?.length || 0}</div>
                                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Links</div>
                                </div>
                                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 text-center hover:scale-105 transition-transform">
                                    <div className="text-2xl font-bold text-purple-600">{data.images?.length || 0}</div>
                                    <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Images</div>
                                </div>
                                <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 text-center hover:scale-105 transition-transform">
                                    <div className="text-2xl font-bold text-pink-600">{data.headers?.length || 0}</div>
                                    <div className="text-xs font-bold text-pink-400 uppercase tracking-wider">Headers</div>
                                </div>
                                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-center hover:scale-105 transition-transform">
                                    <div className="text-2xl font-bold text-emerald-600">{data.wordCount || 0}</div>
                                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Words</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* SEO Metadata Table */}
                                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <h3 className="font-semibold text-gray-700">SEO Metadata</h3>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        <div className="px-6 py-4 grid grid-cols-3 gap-4 hover:bg-gray-50/30 transition-colors">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider col-span-1">Title</span>
                                            <span className="text-sm text-gray-700 font-medium col-span-2">{data.title}</span>
                                        </div>
                                        {Object.entries(data.metaTags || {}).slice(0, 5).map(([key, value]) => (
                                            <div key={key} className="px-6 py-4 grid grid-cols-3 gap-4 hover:bg-gray-50/30 transition-colors">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider col-span-1 break-words">{key}</span>
                                                <span className="text-sm text-gray-600 col-span-2 break-words">{String(value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Link Analysis Table */}
                                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <h3 className="font-semibold text-gray-700">Top Links</h3>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50/30 sticky top-0 backdrop-blur-sm">
                                                <tr>
                                                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Anchor Text</th>
                                                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">URL</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {data.links?.slice(0, 8).map((link: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-indigo-50/10 transition-colors">
                                                        <td className="px-6 py-3 text-sm text-gray-700 font-medium truncate max-w-[150px]">{link.text || 'N/A'}</td>
                                                        <td className="px-6 py-3 text-xs text-indigo-500 font-mono truncate max-w-[200px]">
                                                            <a href={link.url} target="_blank" className="hover:underline">{link.url}</a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Headers & Structure */}
                            {data.headers && data.headers.length > 0 && (
                                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                        <h3 className="font-semibold text-gray-700">Page Structure</h3>
                                    </div>
                                    <div className="p-6 flex flex-wrap gap-3">
                                        {data.headers.map((h: any, i: number) => (
                                            <span key={i} className={`px-3 py-1 rounded-lg text-xs font-medium border ${h.tag === 'h1' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                h.tag === 'h2' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    'bg-gray-50 text-gray-600 border-gray-100'
                                                }`}>
                                                <span className="opacity-50 mr-2 uppercase">{h.tag}</span>
                                                {h.text.slice(0, 50)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CONTENT TAB */}
                    {activeTab === 'content' && (
                        <div className="relative">
                            <div className="absolute top-2 right-2">
                                <button
                                    onClick={() => handleCopy(data.textContent, 'text')}
                                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition-colors"
                                >
                                    {copyStatus === 'text' ? 'Copied!' : 'Copy Text'}
                                </button>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-6 h-[500px] overflow-y-auto shadow-inner">
                                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                                    {data.textContent || 'No text content available.'}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* IMAGES TAB */}
                    {activeTab === 'images' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {data.images?.map((img: any, idx: number) => (
                                <div key={idx} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                                        {img.alt || 'No description'}
                                    </div>
                                </div>
                            ))}
                            {(!data.images || data.images.length === 0) && (
                                <div className="col-span-full py-12 text-center text-gray-400">
                                    No images found on this page.
                                </div>
                            )}
                        </div>
                    )}

                    {/* JSON TAB */}
                    {activeTab === 'json' && (
                        <div className="relative">
                            <div className="absolute top-2 right-2 z-10">
                                <button
                                    onClick={() => handleCopy(JSON.stringify(data, null, 2), 'json')}
                                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors border border-gray-600"
                                >
                                    {copyStatus === 'json' ? 'Copied!' : 'Copy JSON'}
                                </button>
                            </div>
                            <div className="bg-[#1e1e2e] rounded-xl p-4 h-[600px] overflow-hidden shadow-inner font-mono text-sm border border-gray-800">
                                <div className="h-full overflow-y-auto custom-scrollbar">
                                    <pre className="text-blue-300">
                                        {JSON.stringify(data, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
