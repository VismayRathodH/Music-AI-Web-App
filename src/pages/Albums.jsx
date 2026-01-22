import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { musicApiService } from '../services/musicApiService';
import { Play, Loader, Search } from 'lucide-react';

const Albums = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const fetchArtists = async (query = 'top artists') => {
        setLoading(true);
        try {
            const results = await musicApiService.searchTracks(query);
            // Filter to ensure we have diverse results, implicitly acting as "artists" discovery
            setArtists(results);
        } catch (err) {
            console.error("Failed to fetch artists", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            fetchArtists(searchQuery);
        }
    };

    const handleArtistClick = (artistName) => {
        // Navigate to search page and auto-search for this artist
        navigate(`/search?q=${encodeURIComponent(artistName)}`);
    };

    return (
        <div className="space-y-6 min-h-[80vh]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-white">Discover Music</h2>
                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search artists or songs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-6 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader className="animate-spin text-[var(--accent-primary)]" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {artists.length > 0 ? (
                        artists.map((item, index) => (
                            <div
                                key={item.id || index}
                                onClick={() => handleArtistClick(item.artist !== "Unknown" ? item.artist : item.title)}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-xl relative bg-gray-800 border-2 border-transparent group-hover:border-[var(--accent-primary)] transition-all duration-300">
                                    <img
                                        src={item.cover}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button className="w-16 h-16 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                                            <Play fill="currentColor" size={28} className="ml-1" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-white text-lg truncate text-center group-hover:text-[var(--accent-primary)] transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-sm text-center">{item.artist}</p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-400 py-10">
                            No results found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Albums;
