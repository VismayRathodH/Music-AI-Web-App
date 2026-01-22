
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, Plus, Play, Music } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

const Library = () => {
    const { user } = useAuth();
    const { playSong, likedSongs, setQueue } = usePlayer();
    const [mySongs, setMySongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMySongs = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('songs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) console.error(error);
            else setMySongs(data || []);
            setLoading(false);
        };
        fetchMySongs();
    }, [user]);

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h2 className="text-4xl font-bold text-white">Your Library</h2>
                <Link to="/ai-playlist" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors">
                    <Plus size={20} />
                    <span>New AI Playlist</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Liked Songs Card */}
                <div
                    onClick={() => {
                        if (likedSongs.length > 0) {
                            setQueue(likedSongs);
                            playSong(likedSongs[0]);
                        }
                    }}
                    className="col-span-1 md:col-span-2 lg:col-span-1 aspect-video lg:aspect-square bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 rounded-2xl p-8 relative overflow-hidden group cursor-pointer shadow-2xl"
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute top-8 left-8">
                        <Heart size={40} className="text-white fill-white animate-pulse" />
                    </div>
                    <div className="absolute bottom-8 left-8 relative z-10">
                        <div className="mb-4">
                            <h3 className="text-3xl font-bold text-white">Liked Songs</h3>
                            <p className="text-white/80">{likedSongs.length} songs</p>
                        </div>
                        <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play fill="currentColor" size={24} className="ml-1" />
                        </button>
                    </div>
                </div>

                {/* My Uploads Card (shifted or as a list) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 aspect-video lg:aspect-square bg-white/5 rounded-2xl p-8 relative overflow-hidden group cursor-pointer border border-white/5 hover:bg-white/10 transition-all">
                    <div className="absolute bottom-8 left-8">
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold text-white">My Uploads</h3>
                            <p className="text-gray-400">{mySongs.length} tracks</p>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white">
                            <Music size={20} />
                        </div>
                    </div>
                </div>

                {/* Liked Songs List (instead of just uploads) */}
                <div className="glass-panel p-6 col-span-1 md:col-span-2 overflow-y-auto max-h-[400px]">
                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#0a0a0a] z-10 py-2">
                        <div className="flex items-center space-x-2 text-gray-400">
                            <Heart size={16} />
                            <span className="text-sm font-medium uppercase tracking-wider">Recently Liked</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {likedSongs.length === 0 && (
                            <div className="text-center py-10 space-y-4">
                                <div className="p-4 bg-white/5 rounded-full inline-block">
                                    <Heart size={32} className="text-gray-600" />
                                </div>
                                <p className="text-gray-500 text-sm">Songs you like will appear here</p>
                                <Link to="/search" className="inline-block px-6 py-2 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
                                    Find Songs
                                </Link>
                            </div>
                        )}
                        {likedSongs.map((song, idx) => (
                            <div
                                key={song.id + idx}
                                onClick={() => {
                                    setQueue(likedSongs);
                                    playSong(song);
                                }}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                                        <img src={song.cover || song.cover_url} alt={song.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Play size={16} fill="white" className="text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-white font-medium group-hover:text-[var(--accent-primary)] transition-colors">{song.title}</div>
                                        <div className="text-xs text-gray-500">{song.artist || "Unknown Artist"}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Heart size={16} className="text-red-500 fill-red-500" />
                                    {song.duration && <span className="text-xs text-gray-500">{song.duration}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/artists" className="glass-panel p-6 flex items-center justify-center hover:bg-white/10 transition-colors h-32">
                    <span className="text-xl font-bold text-white">Artists</span>
                </Link>
                <Link to="/albums" className="glass-panel p-6 flex items-center justify-center hover:bg-white/10 transition-colors h-32">
                    <span className="text-xl font-bold text-white">Albums</span>
                </Link>
                <div className="glass-panel p-6 flex items-center justify-center hover:bg-white/10 transition-colors h-32 cursor-pointer">
                    <span className="text-xl font-bold text-white">Podcasts</span>
                </div>
                <div className="glass-panel p-6 flex items-center justify-center hover:bg-white/10 transition-colors h-32 cursor-pointer">
                    <span className="text-xl font-bold text-white">Local Files</span>
                </div>
            </div>
        </div>
    );
};

export default Library;
