
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const MusicPlayer = () => {
    const {
        currentSong,
        isPlaying,
        togglePlay,
        nextSong,
        prevSong,
        currentTime,
        duration,
        seek,
        volume,
        setVolume
    } = usePlayer();

    const formatTime = (time) => {
        if (!time) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = (e) => {
        const time = (e.target.value / 100) * duration;
        seek(time);
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    if (!currentSong) {
        return (
            <div className="w-full flex items-center justify-center h-full text-gray-500 text-sm">
                Select a song to start playing
            </div>
        );
    }

    return (
        <div className="w-full flex items-center justify-between h-full bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 px-2">
            {/* Track Info */}
            <div className="flex items-center w-1/4 space-x-4">
                <div className="w-14 h-14 rounded-md bg-gray-800 overflow-hidden relative group">
                    <img
                        src={currentSong.cover_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop"}
                        alt="Album Art"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Heart size={18} className="text-white cursor-pointer hover:text-red-500 transition-colors" />
                    </div>
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-white font-medium text-sm truncate">{currentSong.title}</span>
                    <span className="text-gray-400 text-xs truncate">{currentSong.artist || "Unknown Artist"}</span>
                </div>
            </div>

            {/* Controls & Progress */}
            <div className="flex flex-col items-center justify-center flex-1 max-w-2xl px-4">
                <div className="flex items-center space-x-6 mb-2">
                    <button className="text-gray-400 hover:text-white transition-colors"><Shuffle size={16} /></button>
                    <button onClick={prevSong} className="text-gray-300 hover:text-white transition-colors"><SkipBack size={20} fill="currentColor" /></button>
                    <button
                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                        onClick={togglePlay}
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>
                    <button onClick={nextSong} className="text-gray-300 hover:text-white transition-colors"><SkipForward size={20} fill="currentColor" /></button>
                    <button className="text-gray-400 hover:text-white transition-colors"><Repeat size={16} /></button>
                </div>

                <div className="w-full flex items-center space-x-3 text-xs text-gray-400 font-mono">
                    <span className="w-10 text-right">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress || 0}
                        onChange={handleSeek}
                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[var(--accent-primary)] hover:accent-[var(--accent-secondary)]"
                    />
                    <span className="w-10">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume */}
            <div className="w-1/4 flex justify-end items-center space-x-3">
                <Volume2 size={18} className="text-gray-400" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-gray-400 hover:accent-[var(--accent-primary)]"
                />
            </div>
        </div>
    );
};

export default MusicPlayer;
