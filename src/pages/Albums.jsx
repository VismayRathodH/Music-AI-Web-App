import React from 'react';
import { albums } from '../data/mockData';
import { Play } from 'lucide-react';

const Albums = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {albums.map((album) => (
                    <div key={album.id} className="group cursor-pointer">
                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-xl relative bg-gray-800">
                            <img src={album.cover} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <button className="w-14 h-14 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                                    <Play fill="currentColor" size={24} className="ml-1" />
                                </button>
                            </div>
                        </div>
                        <h3 className="font-bold text-white text-lg truncate">{album.title}</h3>
                        <p className="text-gray-400 text-sm">{album.artist} • {album.year}</p>
                    </div>
                ))}

                {/* Mock more */}
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={`mock-${i}`} className="group cursor-pointer">
                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-800 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
                        </div>
                        <div className="h-6 w-3/4 bg-gray-800 rounded mb-2" />
                        <div className="h-4 w-1/2 bg-gray-800 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Albums;
