import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [volume, setVolume] = useState(0.5);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const audioRef = useRef(new Audio());

    // Play a specific song
    const playSong = (song) => {
        if (currentSong?.id === song.id) {
            togglePlay();
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
            if (!queue.find(s => s.id === song.id)) {
                setQueue(prev => [...prev, song]); // Add to queue if not present
            }
        }
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const nextSong = () => {
        if (!queue.length) return;
        const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
        const nextIndex = (currentIndex + 1) % queue.length;
        setCurrentSong(queue[nextIndex]);
        setIsPlaying(true);
    };

    const prevSong = () => {
        if (!queue.length) return;
        const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        setCurrentSong(queue[prevIndex]);
        setIsPlaying(true);
    };

    // Audio element event listeners
    useEffect(() => {
        const audio = audioRef.current;

        // Update audio source when song changes
        if (currentSong) {
            audio.src = currentSong.url;
            if (isPlaying) {
                audio.play().catch(e => console.error("Playback failed:", e));
            }
        } else {
            audio.pause();
            audio.currentTime = 0;
        }

        return () => {
            audio.pause();
        };
    }, [currentSong]);

    // Handle play/pause toggle
    useEffect(() => {
        const audio = audioRef.current;
        if (currentSong) {
            if (isPlaying) audio.play().catch(e => console.error(e));
            else audio.pause();
        }
    }, [isPlaying]);

    // Volume control
    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    // Time updates
    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => nextSong(); // Auto play next

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentSong, queue]); // specific dependency on queue for nextSong closure if needed, though state updater usage is better

    const seek = (time) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const value = {
        currentSong,
        isPlaying,
        queue,
        volume,
        duration,
        currentTime,
        playSong,
        togglePlay,
        nextSong,
        prevSong,
        setVolume,
        seek,
        addToQueue: (song) => setQueue(prev => [...prev, song]),
        setQueue
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);
