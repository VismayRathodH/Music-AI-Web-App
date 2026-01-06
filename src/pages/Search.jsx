import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, MoreHorizontal, Disc, User, Music, Loader } from 'lucide-react';
import { musicApiService } from '../services/musicApiService';
import { Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const Search = () => {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const { playSong } = usePlayer();

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    // Fetch live data
    useEffect(() => {
        if (!debouncedQuery) {
            setResults([]);
            return;
        }

        const fetchMusic = async () => {
            setLoading(true);
            try {
                const data = await musicApiService.searchTracks(debouncedQuery);
                setResults(data);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMusic();
    }, [debouncedQuery]);

    return (
        <div className="space-y-8 min-h-screen pb-20">
            {/* Search Header */}
            <div className="sticky top-0 bg-[#050505]/95 backdrop-blur-xl z-20 pb-4 pt-2 -mt-2">
                <div className="relative max-w-2xl">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search songs, artists, albums..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 focus:border-white/20 transition-all text-lg"
                        autoFocus
                    />
                    {loading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader className="animate-spin text-gray-400" size={20} />
                        </div>
                    )}
                </div>

                {/* Filter Chips */}
                <div className="flex items-center space-x-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                    {['all', 'songs', 'artists'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${activeTab === tab
                                ? 'bg-white text-black'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* LIVE Results */}
            <div className="space-y-10">
                {results.length === 0 && !loading && debouncedQuery && (
                    <div className="text-center text-gray-500 py-10">
                        No results found for "{debouncedQuery}"
                    </div>
                )}

                {results.length === 0 && !debouncedQuery && (
                    <div className="text-center text-gray-500 py-10">
                        Try searching for your favorite artist or song!
                    </div>
                )}

                {/* Songs Section */}
                {(activeTab === 'all' || activeTab === 'songs') && results.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Top Results</h2>
                        <div className="space-y-2">
                            {results.map((song) => (
                                <div key={song.id}
                                    onClick={() => playSong(song)}
                                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-12 h-12 bg-gray-800 rounded group-hover:bg-gray-700 flex items-center justify-center overflow-hidden">
                                            <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play size={20} className="text-white" fill="currentColor" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-white font-medium truncate max-w-[200px] md:max-w-md">{song.title}</div>
                                            <div className="text-sm text-gray-400">{song.artist}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Heart size={18} />
                                        </span>
                                        <span className="text-sm text-gray-400">{song.duration}</span>
                                        <button className="text-gray-400 hover:text-white"><MoreHorizontal size={20} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Search;
