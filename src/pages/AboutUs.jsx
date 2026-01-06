import React from 'react';
import { Music, Code, Users } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-16 py-10">
            <div className="text-center space-y-6">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    Redefining Music Discovery
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    Music AI is not just a player; it's an intelligent companion that understands your emotions and curates the perfect sonic landscape for every moment.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-panel p-8 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Music className="text-blue-400" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Smart Curation</h3>
                    <p className="text-gray-400">Our AI algorithms analyze millions of tracks to find hidden gems that match your taste perfectly.</p>
                </div>
                <div className="glass-panel p-8 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Users className="text-purple-400" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Community Driven</h3>
                    <p className="text-gray-400">Connect with fellow audiophiles, share playlists, and discover new scenes together.</p>
                </div>
                <div className="glass-panel p-8 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto bg-pink-500/20 rounded-full flex items-center justify-center">
                        <Code className="text-pink-400" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Modern Tech</h3>
                    <p className="text-gray-400">Built with the latest web technologies for a seamless, app-like experience on any device.</p>
                </div>
            </div>

            <div className="bg-white/5 rounded-3xl p-10 text-center space-y-6">
                <h2 className="text-3xl font-bold text-white">Join the Revolution</h2>
                <p className="text-gray-400">Experience music like never before.</p>
            </div>
        </div>
    );
};

export default AboutUs;
