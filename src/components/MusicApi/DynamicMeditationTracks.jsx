import React, { useEffect, useState } from 'react';
import { Play, Music } from 'lucide-react';
import { musicApiService } from '../../services/musicApiService';
import { usePlayer } from '../../context/PlayerContext';

const DynamicMeditationTracks = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playSong } = usePlayer();

    useEffect(() => {
        const fetchMeditationMusic = async () => {
            try {
                // Search for "meditation ambient" to get relevant tracks
                const results = await musicApiService.searchTracks('meditation ambient nature');
                setTracks(results.slice(0, 4)); // Show top 4
            } catch (error) {
                console.error("Failed to fetch meditation tracks", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMeditationMusic();
    }, []);

    if (loading) return null;
    if (tracks.length === 0) return null;

    return (
        <section>
            <h3 className="text-2xl font-bold text-white mb-6">New Arrivals (Live)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tracks.map((track) => (
                    <div key={track.id}
                        onClick={() => playSong(track)}
                        className="glass-panel p-4 flex flex-col hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-gray-800">
                            <img src={track.cover} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--accent-primary)] hover:border-transparent border border-white/30">
                                    <Play size={16} fill="currentColor" />
                                </button>
                            </div>
                        </div>
                        <h4 className="font-semibold text-white truncate text-lg">{track.title}</h4>
                        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DynamicMeditationTracks;
