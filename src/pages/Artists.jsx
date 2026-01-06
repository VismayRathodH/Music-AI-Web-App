import React from 'react';
import { artists } from '../data/mockData';

const Artists = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Artists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {artists.map((artist) => (
                    <div key={artist.id} className="glass-panel p-6 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group rounded-2xl">
                        <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-white/5 group-hover:border-[var(--accent-primary)] transition-colors shadow-2xl">
                            <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white text-center">{artist.name}</h3>
                        <p className="text-sm text-[var(--accent-secondary)] mt-1">{artist.genre}</p>
                    </div>
                ))}

                {/* Mock more artists */}
                {[1, 2, 3, 4].map((i) => (
                    <div key={`mock-${i}`} className="glass-panel p-6 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group rounded-2xl">
                        <div className="w-40 h-40 rounded-full bg-gray-800 mb-4 animate-pulse" />
                        <div className="h-6 w-24 bg-gray-800 rounded animate-pulse mb-2" />
                        <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Artists;
