
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, Plus, Play, Music } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

const Library = () => {
    const { user } = useAuth();
    const { playSong } = usePlayer();
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
                <div className="col-span-1 md:col-span-2 lg:col-span-1 aspect-video lg:aspect-square bg-gradient-to-br from-[#450af5] to-[#c4b5fd] rounded-2xl p-8 relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-8 left-8 relative z-10">
                        <div className="mb-4">
                            <p className="text-white/80">{mySongs.length} songs</p>
                            <h3 className="text-3xl font-bold text-white">My Uploads</h3>
                        </div>
                        <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                            <Play fill="currentColor" size={24} className="ml-1" />
                        </button>
                    </div>
                </div>

                {/* Song List */}
                <div className="glass-panel p-6 col-span-1 md:col-span-2 overflow-y-auto max-h-[400px]">
                    <div className="flex items-center space-x-2 text-gray-400 mb-4 sticky top-0 bg-[#0a0a0a] z-10 py-2">
                        <Music size={16} />
                        <span className="text-sm font-medium uppercase tracking-wider">Your Songs</span>
                    </div>
                    <div className="space-y-2">
                        {loading && <div className="text-gray-500 text-sm">Loading...</div>}
                        {!loading && mySongs.length === 0 && (
                            <div className="text-gray-500 text-sm">You haven't uploaded any songs yet.</div>
                        )}
                        {mySongs.map(song => (
                            <div
                                key={song.id}
                                onClick={() => playSong(song)}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-gray-500">
                                        <Music size={18} />
                                    </div>
                                    <div>
                                        <div className="text-white font-medium group-hover:text-[var(--accent-primary)] transition-colors">{song.title}</div>
                                        <div className="text-xs text-gray-500">{song.artist || "Unknown Artist"}</div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-600 hidden md:block">
                                    {new Date(song.created_at).toLocaleDateString()}
                                </span>
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
