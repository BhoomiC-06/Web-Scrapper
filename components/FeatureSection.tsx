'use client';

export default function FeatureSection() {
    const features = [
        {
            title: "Enterprise Grade",
            desc: "Built on a scalable architecture capable of handling millions of requests per day with 99.9% uptime.",
            icon: (
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            title: "Smart Extraction",
            desc: "Our AI engine automatically identifies products, articles, and metadata without custom rules.",
            icon: (
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            )
        },
        {
            title: "Legal Compliance",
            desc: "Respects robots.txt and rate limits automatically. Ethical scraping built-in by default.",
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        }
    ];

    const stats = [
        { label: "Pages Processed", value: "10M+" },
        { label: "Data Points", value: "500M+" },
        { label: "Success Rate", value: "99.9%" },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto mt-24 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {/* Trust Badge */}
            <div className="text-center mb-16 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                        <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase tracking-widest">
                            Trusted by data teams worldwide
                        </p>
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-10 opacity-70 hover:opacity-100 transition-all duration-500">
                        {[
                            { name: 'TechCorp', color: 'from-blue-500 to-cyan-500' },
                            { name: 'DataFlow', color: 'from-purple-500 to-pink-500' },
                            { name: 'WebMine', color: 'from-indigo-500 to-blue-500' },
                            { name: 'ScrapeAI', color: 'from-emerald-500 to-teal-500' }
                        ].map((company, i) => (
                            <div key={i} className="group flex flex-col items-center">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${company.color} flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}> 
                                    {company.name.charAt(0)}
                                </div>
                                <span className="text-xs font-bold text-gray-500 mt-2 group-hover:text-gray-700 transition-colors">
                                    {company.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {features.map((feature, idx) => (
                    <div key={idx} className="group relative bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl hover:bg-white/90 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]">
                        {/* Glow effect on hover */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-gray-100">
                                <div className="p-2">
                                    {feature.icon}
                                </div>
                                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {feature.desc}
                            </p>
                            
                            {/* Decorative element */}
                            <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats Section */}
            <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 rounded-3xl p-10 md:p-16 text-white shadow-2xl overflow-hidden border border-white/10">
                {/* Animated background elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-black mb-4">By The Numbers</h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="group relative p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
                                <div className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-indigo-200 to-purple-200 mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {stat.value}
                                </div>
                                <div className="text-indigo-200 font-black uppercase tracking-widest text-sm mb-2">
                                    {stat.label}
                                </div>
                                <div className="w-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-500 mx-auto rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
