
import React, { useEffect, useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Music } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { usePlayer } from '../context/PlayerContext';
import { musicApiService } from '../services/musicApiService';

const Home = () => {
    const [recentSongs, setRecentSongs] = useState([]);
    const [globalHits, setGlobalHits] = useState([]);
    const { playSong } = usePlayer();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
            badge: "Featured Playlist",
            title: "Midnight Vibes",
            description: "Curated deep house tracks for your late night coding sessions."
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop",
            badge: "Trending Now",
            title: "Neon Nights",
            description: "Synthwave classics to fuel your retro-futuristic dreams."
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
            badge: "Focus Mode",
            title: "Deep Flow",
            description: "Ambient soundscapes for maximum productivity and concentration."
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop",
            badge: "Weekend Hype",
            title: "Party Anthems",
            description: "High-energy beats to get the weekend started right."
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=2070&auto=format&fit=crop",
            badge: "Chillout",
            title: "Lofi Study",
            description: "Relaxing beats to study and chill to."
        }
    ];

    useEffect(() => {
        const fetchSongs = async () => {
            const { data, error } = await supabase
                .from('songs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(8);

            if (error) console.error('Error fetching songs:', error);
            else {
                // Filter out banned content
                const filteredData = (data || []).filter(song => {
                    const title = song.title?.toLowerCase() || '';
                    const artist = song.artist?.toLowerCase() || '';
                    return !title.includes('imagin_dragon') &&
                        !artist.includes('imagin_dragon') &&
                        !title.includes('imagine dragons') &&
                        !artist.includes('imagine dragons') &&
                        !title.includes('imagine_dragons') &&
                        !artist.includes('imagine_dragons');
                });
                setRecentSongs(filteredData);
            }
        };
        fetchSongs();
    }, []);

    // Fetch Global Hits from Music API
    useEffect(() => {
        const fetchHits = async () => {
            try {
                const hits = await musicApiService.searchTracks('top hits 2024');
                // Filter out banned content
                const filteredHits = hits.filter(song => {
                    const title = song.title?.toLowerCase() || '';
                    const artist = song.artist?.toLowerCase() || '';
                    return !title.includes('imagin_dragon') &&
                        !artist.includes('imagin_dragon') &&
                        !title.includes('imagine dragons') &&
                        !artist.includes('imagine dragons') &&
                        !title.includes('imagine_dragons') &&
                        !artist.includes('imagine_dragons');
                });
                setGlobalHits(filteredHits.slice(0, 5)); // Take top 5
            } catch (error) {
                console.error("Error fetching hits:", error);
            }
        };
        fetchHits();
    }, []);

    // Auto-slide logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="space-y-12 pb-10">
            {/* Hero Section Carousel */}
            <section className="relative rounded-2xl overflow-hidden h-80 group">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[rgba(5,5,5,0.5)] to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 space-y-4 max-w-2xl">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/10">
                                {slide.badge}
                            </span>
                            <h2 className="text-5xl font-bold text-white drop-shadow-2xl animate-fade-in-up">
                                {slide.title}
                            </h2>
                            <p className="text-gray-300 text-lg animate-fade-in-up delay-100">
                                {slide.description}
                            </p>
                            <button className="flex items-center space-x-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white px-6 py-3 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] animate-fade-in-up delay-200">
                                <noPlay fill="currentColor" size={20} />
                                <span>Enjoy The Lyrics</span>
                            </button>
                        </div>
                    </div>
                ))}

                {/* Navigation Dots */}
                <div className="absolute bottom-6 right-8 flex space-x-2 z-10">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide
                                ? 'w-8 bg-[var(--accent-primary)]'
                                : 'bg-white/30 hover:bg-white/50'
                                }`}
                        />
                    ))}
                </div>

                {/* Arrows (Visible on Hover) */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
                >
                    <ChevronRight size={24} />
                </button>
            </section>

            {/* LIVE: Global Hits Section */}
            {globalHits.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Trending Global Hits</h3>
                        <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Live from Music API</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {globalHits.map((song) => (
                            <div key={song.id}
                                onClick={() => playSong(song)}
                                className="glass-panel p-4 group cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 group-hover:opacity-100 transition-opacity" />
                                    <img src={song.cover} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute bottom-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <button className="w-10 h-10 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-lg hover:bg-white hover:text-black">
                                            <Play fill="currentColor" size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h4 className="font-semibold text-white truncate text-base">{song.title}</h4>
                                <p className="text-sm text-gray-400 truncate mt-1">{song.artist}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Quick Picks Row */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Jump Back In</h3>
                </div>

                {recentSongs.length === 0 ? (
                    <div className="text-gray-500 italic">No songs uploaded yet. Go to Upload page to share music!</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {recentSongs.map((song) => (
                            <div key={song.id} className="glass-panel p-4 group cursor-pointer hover:bg-white/5 transition-colors" onClick={() => playSong(song)}>
                                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-800">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:opacity-100 transition-opacity" />
                                    {song.cover_url ? (
                                        <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                                            <Music size={40} />
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <button className="w-10 h-10 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                            <Play fill="currentColor" size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h4 className="font-semibold text-white truncate">{song.title}</h4>
                                <p className="text-sm text-gray-400 truncate">{song.artist || "Unknown Artist"}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
