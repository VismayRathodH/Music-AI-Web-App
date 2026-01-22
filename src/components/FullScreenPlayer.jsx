import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Shuffle, Repeat, Heart } from 'lucide-react';

const FullScreenPlayer = () => {
    const navigate = useNavigate();
    const {
        currentSong,
        isPlaying,
        togglePlay,
        nextSong,
        prevSong,
        currentTime,
        duration,
        seek,
        isShuffle,
        toggleShuffle,
        repeatMode,
        cycleRepeatMode,
        toggleLike,
        isLiked
    } = usePlayer();

    const [localProgress, setLocalProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!isDragging) {
            setLocalProgress((currentTime / duration) * 100 || 0);
        }
    }, [currentTime, duration, isDragging]);

    const handleSeekChange = (e) => {
        const newValue = e.target.value;
        setLocalProgress(newValue);
        setIsDragging(true);
    };

    const handleSeekEnd = (e) => {
        const newValue = e.target.value;
        const newTime = (newValue / 100) * duration;
        seek(newTime);
        setIsDragging(false);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleClose = () => {
        navigate(-1); // Go back to previous page
    };

    if (!currentSong) {
        return (
            <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
                <div className="text-white text-center">
                    <p className="text-xl">No song is currently playing</p>
                    <button
                        onClick={handleClose}
                        className="mt-4 px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-between p-4 md:p-8 animate-slide-up overflow-hidden">
            {/* Header / Minimize */}
            <div className="w-full flex justify-between items-center text-white/50 h-16 shrink-0">
                <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ChevronDown size={32} />
                </button>
                <div className="flex space-x-2">
                    {/* Signal/Battery dummy icons could go here if mimicking mobile status bar */}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center w-full max-w-md space-y-6 md:space-y-8 flex-1 min-h-0">
                {/* Album Art with Glow */}
                <div className="relative w-[70vw] h-[70vw] max-w-[300px] max-h-[300px] md:w-96 md:h-96 md:max-w-none md:max-h-none group shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/5 shadow-2xl animate-spin-slow" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                        <img
                            src={currentSong.cover || currentSong.cover_url}
                            alt={currentSong.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Glossy overlay effect to look like a bubble */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none rounded-full"></div>
                    </div>
                </div>

                {/* Song Info */}
                <div className="text-center space-y-2 px-4 relative w-full">
                    <div className="flex items-center justify-center space-x-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight line-clamp-1">{currentSong.title}</h2>
                            <p className="text-base md:text-lg text-gray-400 font-medium line-clamp-1">{currentSong.artist}</p>
                        </div>
                        <button
                            onClick={() => toggleLike(currentSong)}
                            className="shrink-0 p-2 hover:bg-white/10 rounded-full transition-all"
                        >
                            <Heart
                                size={28}
                                className={`${isLiked(currentSong.id) ? 'text-red-500 fill-red-500' : 'text-white/70 hover:text-white'} transition-all`}
                            />
                        </button>
                    </div>
                </div>

                {/* Quote */}
                <div className="text-white/60 font-serif italic text-base md:text-lg opacity-80 hidden sm:block">
                    "When words fail, music speaks."
                </div>
            </div>

            {/* Controls Section */}
            <div className="w-full max-w-md space-y-6 pb-8">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={localProgress}
                        onChange={handleSeekChange}
                        onMouseUp={handleSeekEnd}
                        onTouchEnd={handleSeekEnd}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                    <div className="flex justify-between text-xs text-gray-400 font-medium font-mono">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-between px-4">
                    <button
                        onClick={toggleShuffle}
                        className={`${isShuffle ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors relative`}
                    >
                        <Shuffle size={20} />
                        {isShuffle && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </button>

                    <button
                        onClick={prevSong}
                        className="text-white hover:text-[#c4b5fd] transition-colors active:scale-95"
                    >
                        <SkipBack size={32} fill="currentColor" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-15 h-15 bg-white rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
                    >
                        {isPlaying ? (
                            <Pause size={32} fill="currentColor" />
                        ) : (
                            <Play size={32} fill="currentColor" className="ml-1" />
                        )}
                    </button>

                    <button
                        onClick={nextSong}
                        className="text-white hover:text-[#c4b5fd] transition-colors active:scale-95"
                    >
                        <SkipForward size={32} fill="currentColor" />
                    </button>

                    <button
                        onClick={cycleRepeatMode}
                        className={`${repeatMode !== 'none' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors relative`}
                    >
                        <Repeat size={20} />
                        {repeatMode !== 'none' && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                        {repeatMode === 'one' && (
                            <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-white text-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-black">1</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 -z-10 bg-black overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#450af5] rounded-full blur-[120px] opacity-20"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#c4b5fd] rounded-full blur-[120px] opacity-10"></div>
            </div>
        </div>
    );
};

export default FullScreenPlayer;
