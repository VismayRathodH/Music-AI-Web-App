import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import YouTubePlayer from '../components/YouTubePlayer';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [volume, setVolume] = useState(0.5);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
    const [repeatMode, setRepeatMode] = useState('none'); // none, one, all
    const [isShuffle, setIsShuffle] = useState(false);
    const [likedSongs, setLikedSongs] = useState([]);
    const youtubePlayerRef = useRef(null);

    // Load liked songs on mount/auth change
    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                const { data: { user } } = await (await import('../supabaseClient')).supabase.auth.getUser();
                if (user) {
                    const { supabase } = await import('../supabaseClient');
                    const { data, error } = await supabase
                        .from('liked_songs')
                        .select('song_data')
                        .eq('user_id', user.id);

                    if (!error && data) {
                        setLikedSongs(data.map(item => item.song_data));
                        return;
                    }
                }
            } catch (err) {
                console.error("Failed to fetch liked songs from DB:", err);
            }

            // Fallback to local storage if guest or error
            const saved = localStorage.getItem('liked_songs');
            if (saved) setLikedSongs(JSON.parse(saved));
        };
        fetchLikedSongs();
    }, []);

    useEffect(() => {
        localStorage.setItem('liked_songs', JSON.stringify(likedSongs));
    }, [likedSongs]);
    const [secondsListened, setSecondsListened] = useState(0);
    const [lastSyncTime, setLastSyncTime] = useState(Date.now());

    // Track playtime
    useEffect(() => {
        let interval;
        if (isPlaying && currentSong) {
            interval = setInterval(() => {
                setSecondsListened(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentSong]);

    // Sync playtime with Supabase
    useEffect(() => {
        const syncPlaytime = async () => {
            // Sync every 30 seconds or if substantial time has passed
            if (secondsListened > 0 && (Date.now() - lastSyncTime > 30000)) {
                try {
                    const { data: { user } } = await (await import('../supabaseClient')).supabase.auth.getUser();
                    if (user) {
                        const { supabase } = await import('../supabaseClient');

                        // First get current value
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('minutes_listened')
                            .eq('id', user.id)
                            .single();

                        const currentMinutes = profile?.minutes_listened || 0;
                        const newMinutes = currentMinutes + Math.floor(secondsListened / 60);

                        if (newMinutes > currentMinutes) {
                            await supabase
                                .from('profiles')
                                .update({ minutes_listened: newMinutes })
                                .eq('id', user.id);

                            setSecondsListened(prev => prev % 60); // Keep remaining seconds
                            setLastSyncTime(Date.now());
                        }
                    }
                } catch (err) {
                    console.error("Failed to sync playtime:", err);
                }
            }
        };

        syncPlaytime();
    }, [secondsListened, lastSyncTime]);

    // Play a specific song
    const playSong = (song) => {
        if (currentSong?.id === song.id) {
            togglePlay();
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
            setIsPlayerExpanded(true); // Auto expand on play
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

        let nextIndex;
        const currentIndex = queue.findIndex(s => s.id === currentSong?.id);

        if (isShuffle) {
            nextIndex = Math.floor(Math.random() * queue.length);
            // Try to avoid playing the same song if queue > 1
            if (nextIndex === currentIndex && queue.length > 1) {
                nextIndex = (nextIndex + 1) % queue.length;
            }
        } else {
            nextIndex = (currentIndex + 1) % queue.length;
            // If at the end and repeat is 'none', stop or loop based on 'all'
            if (currentIndex === queue.length - 1 && repeatMode === 'none') {
                setIsPlaying(false);
                return;
            }
        }

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

    const seek = (time) => {
        if (window.__youtubePlayer && window.__youtubePlayer.seekTo) {
            window.__youtubePlayer.seekTo(time, true);
            setCurrentTime(time);
        }
    };

    const handleYouTubeStateChange = (event) => {
        // YouTube Player States:
        // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
        if (event.data === 0) { // Video ended
            if (repeatMode === 'one') {
                setIsPlaying(true); // Will restart via effect
            } else {
                nextSong();
            }
        }
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
        setQueue,
        togglePlayerExpanded: () => setIsPlayerExpanded(prev => !prev),
        repeatMode,
        setRepeatMode,
        isShuffle,
        setIsShuffle,
        toggleShuffle: () => setIsShuffle(prev => !prev),
        cycleRepeatMode: () => {
            const modes = ['none', 'all', 'one'];
            const currentIndex = modes.indexOf(repeatMode);
            setRepeatMode(modes[(currentIndex + 1) % modes.length]);
        },
        likedSongs,
        toggleLike: async (song) => {
            const isCurrentlyLiked = likedSongs.some(s => s.id === song.id);

            // Optimistic UI update
            setLikedSongs(prev => {
                if (isCurrentlyLiked) return prev.filter(s => s.id !== song.id);
                return [...prev, song];
            });

            try {
                const { data: { user } } = await (await import('../supabaseClient')).supabase.auth.getUser();
                if (user) {
                    const { supabase } = await import('../supabaseClient');
                    if (isCurrentlyLiked) {
                        await supabase
                            .from('liked_songs')
                            .delete()
                            .eq('user_id', user.id)
                            .eq('song_id', song.id);
                    } else {
                        await supabase
                            .from('liked_songs')
                            .insert([{
                                user_id: user.id,
                                song_id: song.id,
                                song_data: song
                            }]);
                    }
                }
            } catch (err) {
                console.error("Failed to sync like status with DB:", err);
            }
        },
        isLiked: (songId) => likedSongs.some(s => s.id === songId),
        secondsListened
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
            <YouTubePlayer
                videoId={currentSong?.id}
                isPlaying={isPlaying}
                volume={volume}
                onStateChange={handleYouTubeStateChange}
                onTimeUpdate={(time) => setCurrentTime(time)}
                onDuration={(dur) => setDuration(dur)}
            />
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);
