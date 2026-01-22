import React, { useEffect, useRef } from 'react';

/**
 * YouTube IFrame Player Component
 * Uses YouTube IFrame Player API for official playback
 */
const YouTubePlayer = ({ videoId, isPlaying, onReady, onStateChange, onTimeUpdate, onDuration, volume }) => {
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        // Load YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                initializePlayer();
            };
        } else {
            initializePlayer();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, []);

    const initializePlayer = () => {
        if (containerRef.current && !playerRef.current) {
            playerRef.current = new window.YT.Player(containerRef.current, {
                height: '0',
                width: '0',
                videoId: videoId || '',
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    playsinline: 1
                },
                events: {
                    onReady: handlePlayerReady,
                    onStateChange: handleStateChange
                }
            });
        }
    };

    const handlePlayerReady = (event) => {
        if (onReady) onReady(event);
        if (onDuration) {
            const duration = playerRef.current.getDuration();
            onDuration(duration);
        }

        // Start time update interval
        intervalRef.current = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                const currentTime = playerRef.current.getCurrentTime();
                if (onTimeUpdate) onTimeUpdate(currentTime);
            }
        }, 100);
    };

    const handleStateChange = (event) => {
        if (onStateChange) onStateChange(event);

        // Update duration when video starts
        if (event.data === window.YT.PlayerState.PLAYING && onDuration) {
            const duration = playerRef.current.getDuration();
            onDuration(duration);
        }
    };

    // Handle video ID changes
    useEffect(() => {
        if (playerRef.current && videoId) {
            playerRef.current.loadVideoById(videoId);
        }
    }, [videoId]);

    // Handle play/pause
    useEffect(() => {
        if (playerRef.current && playerRef.current.playVideo) {
            if (isPlaying) {
                playerRef.current.playVideo();
            } else {
                playerRef.current.pauseVideo();
            }
        }
    }, [isPlaying]);

    // Handle volume
    useEffect(() => {
        if (playerRef.current && playerRef.current.setVolume) {
            playerRef.current.setVolume(volume * 100);
        }
    }, [volume]);

    // Expose player methods
    useEffect(() => {
        window.__youtubePlayer = playerRef.current;
    }, [playerRef.current]);

    return <div ref={containerRef} className="youtube-player-container" style={{ display: 'none' }} />;
};

export default YouTubePlayer;
