
import React, { useState, useEffect } from 'react';
import { Sparkles, Mic, FileAudio, Zap, Play, Clock, Heart, ArrowRight } from 'lucide-react';
import { generatePlaylist } from '../services/aiService';
import { supabase } from '../supabaseClient';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

const AIPlaylist = () => {
    const { playSong, setQueue } = usePlayer();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [playlist, setPlaylist] = useState(null);
    const [allSongs, setAllSongs] = useState([]);
    const [error, setError] = useState('');

    // Mock Recent Creations for UI demo (since we don't save playlists to DB yet)
    const recentCreations = [
        { id: '1', title: 'Golden Hour Lo-Fi', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop', color: 'from-orange-500/20 to-yellow-500/20' },
        { id: '2', title: 'Midnight Coding', cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop', color: 'from-cyan-500/20 to-blue-500/20' },
        { id: '3', title: 'Cardio Pump', cover: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070&auto=format&fit=crop', color: 'from-red-500/20 to-orange-500/20' },
        { id: '4', title: 'Zen Meditation', cover: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2069&auto=format&fit=crop', color: 'from-blue-500/20 to-cyan-500/20' }
    ];

    const suggestedTags = [
        "#FocusFlow", "#DeepHouse", "#Meditation", "#90sRock", "#WorkoutHype"
    ];

    useEffect(() => {
        const fetchSongs = async () => {
            const { data, error } = await supabase.from('songs').select('*');
            if (error) console.error("Error fetching songs:", error);
            else setAllSongs(data || []);
        };
        fetchSongs();
    }, []);

    const handleTagClick = (tag) => {
        const text = tag.replace('#', '') + ' ';
        setPrompt(prev => prev + text);
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setError('');
        setIsGenerating(true);
        setPlaylist(null);

        try {
            if (allSongs.length === 0) {
                // Warning but proceed, as we can now convert pure text requests to API songs
                console.warn("No local songs, proceeding with API only mode.");
            }

            const recommendations = await generatePlaylist(prompt, allSongs);

            // Process recommendations: Check local first, then fetch from API
            const processedPlaylist = await Promise.all(recommendations.map(async (rec) => {
                // 1. Try to find in local library first (by ID if available, or Title/Artist)
                let match = allSongs.find(s =>
                    (rec.isLocal && s.title === rec.title) ||
                    (s.title.toLowerCase() === rec.title.toLowerCase() && s.artist.toLowerCase() === rec.artist.toLowerCase())
                );

                // 2. If not found locally, fetch from iTunes API
                if (!match) {
                    const apiMatch = await import('../services/musicApiService').then(m => m.musicApiService.searchBestMatch(rec.title, rec.artist));
                    if (apiMatch) {
                        return { ...apiMatch, reason: rec.reason, isPreview: true };
                    }
                }

                return match ? { ...match, reason: rec.reason, isPreview: false } : null;
            }));

            // Filter out any songs that couldn't be found at all
            const validSongs = processedPlaylist.filter(s => s !== null);

            if (validSongs.length === 0) {
                setError("AI couldn't find matches in your library or the music database.");
            } else {
                setPlaylist(validSongs);
                setPrompt('');
            }

        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong during generation.");
        } finally {
            setIsGenerating(false);
        }
    };

    const playAll = () => {
        if (!playlist || playlist.length === 0) return;
        setQueue(playlist);
        playSong(playlist[0]);
    };

    const openYouTubeParams = (title, artist) => {
        const query = encodeURIComponent(`${title} ${artist} full audio`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-16 py-8">

            {/* Header / Hero */}
            <div className="text-center space-y-6 relative">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span>AI Engine V2.1 (Global Search Enabled)</span>
                </div>

                <h1 className="text-6xl font-bold text-white tracking-tight">
                    AI Audio Lab
                </h1>

                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Describe your vibe, prompt a genre, or set a mood. Let our neural engine curate the perfect flow for your moment.
                </p>
            </div>

            {/* Main Input Area */}
            <div className="max-w-3xl mx-auto relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 group-hover:opacity-50 blur-xl transition-opacity duration-500" />

                <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 mt-1">
                            <Sparkles size={20} />
                        </div>
                        <div className="flex-1 space-y-4">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Try: 'Upbeat synthwave for a night drive' or 'Binaural beats for deep sleep'..."
                                className="w-full bg-transparent text-white text-lg placeholder-gray-600 outline-none resize-none h-24 font-light"
                            />

                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                <div className="flex items-center space-x-4 text-gray-500">
                                    <button className="hover:text-white transition-colors"><FileAudio size={18} /></button>
                                    <button className="hover:text-white transition-colors"><Mic size={18} /></button>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !prompt.trim()}
                                    className={`px-6 py-2 rounded-lg font-semibold text-white flex items-center space-x-2 shadow-lg transition-all ${isGenerating
                                        ? 'bg-gray-700 cursor-wait'
                                        : 'bg-[#4F46E5] hover:bg-[#4338ca] shadow-indigo-500/25 hover:shadow-indigo-500/40'
                                        }`}
                                >
                                    {isGenerating ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Generate Magic</span>
                                            <Zap size={16} fill="currentColor" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                    {suggestedTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-sm text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all font-medium"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Output Section */}
            {playlist && (
                <div className="max-w-4xl mx-auto glass-panel p-8 animate-fade-in border border-indigo-500/20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Generated Mix</h3>
                            <p className="text-gray-400 text-sm">Curated based on your prompt</p>
                        </div>
                        <button
                            onClick={playAll}
                            className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-bold flex items-center space-x-2 transition-colors"
                        >
                            <Play size={18} fill="currentColor" />
                            <span>Play Full Mix</span>
                        </button>
                    </div>

                    <div className="space-y-2">
                        {playlist.map((track, i) => (
                            <div key={i} className="p-3 rounded-xl hover:bg-white/5 group transition-all cursor-pointer border border-transparent hover:border-white/10 flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1" onClick={() => playSong(track)}>
                                    <div className="w-10 h-10 rounded-md overflow-hidden relative">
                                        <img src={track.cover || track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play size={16} className="text-white" fill="currentColor" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-white font-medium flex items-center gap-2">
                                            {track.title}
                                            {track.isPreview && (
                                                <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500/30">PREVIEW</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">{track.artist}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        {track.reason && (
                                            <div className="text-xs text-indigo-400 italic opacity-70">
                                                "{track.reason}"
                                            </div>
                                        )}
                                    </div>
                                    {track.isPreview && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openYouTubeParams(track.title, track.artist); }}
                                            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
                                            title="Search Full Version on YouTube"
                                        >
                                            <ArrowRight size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center">
                    {error}
                </div>
            )}


            {/* Recent Creations Header */}
            <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Recent Creations</h3>
                    <button className="text-sm text-blue-400 hover:text-blue-300">View all</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentCreations.map((item) => (
                        <div key={item.id} className="group relative bg-[#111] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 duration-300">
                            {/* Image */}
                            <div className="aspect-square relative overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 mix-blend-overlay z-10`} />
                                <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h4 className="font-bold text-white truncate">{item.title}</h4>
                                    <p className="text-xs text-gray-400">Sonic AI • Chill Mix</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default AIPlaylist;
