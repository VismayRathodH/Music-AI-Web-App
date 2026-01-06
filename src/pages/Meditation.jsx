import React from 'react';
import { Wind, CloudRain, Sun, Moon, Play } from 'lucide-react';
import DynamicMeditationTracks from '../components/MusicApi/DynamicMeditationTracks';

const Meditation = () => {
    const soundscapes = [
        { title: "Forest Rain", icon: CloudRain, color: "from-blue-400 to-blue-600" },
        { title: "Zen Garden", icon: Wind, color: "from-green-400 to-green-600" },
        { title: "Morning Light", icon: Sun, color: "from-orange-300 to-yellow-500" },
        { title: "Deep Sleep", icon: Moon, color: "from-indigo-400 to-purple-600" },
    ];

    return (
        <div className="space-y-10">
            <div className="relative rounded-3xl overflow-hidden h-64 bg-gradient-to-r from-teal-900 via-emerald-900 to-green-900 flex items-center px-10">
                <div className="relative z-10 space-y-2">
                    <h2 className="text-4xl font-serif italic text-white/90">Find your center.</h2>
                    <p className="text-emerald-100/80 max-w-md">Curated soundscapes and frequencies for mindfulness, focus, and deep relaxation.</p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
            </div>

            <section>
                <h3 className="text-2xl font-bold text-white mb-6">Ambient Soundscapes</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {soundscapes.map((item, idx) => (
                        <div key={idx} className="glass-panel p-6 flex flex-col items-center justify-center space-y-4 hover:bg-white/5 transition-all cursor-pointer group rounded-2xl">
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <item.icon size={32} className="text-white" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-lg font-medium text-white">{item.title}</h4>
                                <p className="text-xs text-gray-400 mt-1">Continuous Loop</p>
                            </div>
                            <button className="mt-2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--accent-primary)] transition-colors">
                                <Play size={16} fill="currentColor" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <DynamicMeditationTracks />

            <section>
                <h3 className="text-2xl font-bold text-white mb-6">Guided Sessions</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 glass-panel hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="flex items-center space-x-6">
                                <div className="text-white/30 font-serif text-2xl italic">0{i}</div>
                                <div>
                                    <h4 className="text-white font-medium text-lg">Mindfulness Basics {i}</h4>
                                    <p className="text-gray-400 text-sm">10 min • Breathwork & Focus</p>
                                </div>
                            </div>
                            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                                <Play size={20} fill="currentColor" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Meditation;
