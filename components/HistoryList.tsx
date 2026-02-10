'use client';

interface HistoryItem {
    id: number;
    url: string;
    timestamp: string;
    result?: {
        title?: string;
    };
}

interface HistoryListProps {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
}

export default function HistoryList({ history, onSelect }: HistoryListProps) {
    if (history.length === 0) return null;

    return (
        <div className="animate-fade-in mt-12 bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                Recent Activity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="group cursor-pointer bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>

                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                Scraped
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        <h4 className="font-semibold text-gray-800 truncate mb-1 group-hover:text-indigo-600 transition-colors">
                            {item.result?.title || item.url}
                        </h4>

                        <p className="text-xs text-gray-500 truncate font-mono bg-gray-50 p-1 rounded">
                            {item.url}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
