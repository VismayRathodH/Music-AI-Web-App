
import React, { useEffect, useState } from 'react';
import { User, Settings, Heart, Disc, Music, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { supabase } from '../supabaseClient';

const UserProfile = () => {
    const { user, signOut } = useAuth();
    const { secondsListened } = usePlayer();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProfile = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, full_name, avatar_url, minutes_listened')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.warn("Error fetching profile:", error);
                } else {
                    setProfile(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [user]);

    const displayName = profile?.full_name || user?.email?.split('@')[0] || "Music Lover";
    const displayHandle = profile?.username ? `@${profile.username}` : "";

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl shrink-0">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={80} className="text-white/80" />
                        )}
                    </div>
                </div>
                <div className="flex-1 mb-4 text-center md:text-left">
                    <span className="text-sm font-bold uppercase tracking-widest text-white/60">Profile</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 md:mb-6">{displayName}</h1>
                    <p className="text-lg text-gray-400 mb-4">{displayHandle}</p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start space-x-2 text-white/80 mb-6">
                        <span>{profile?.followers_count || 0} Followers</span>
                        <span>•</span>
                        <span>{profile?.following_count || 0} Following</span>
                    </div>

                    <button
                        onClick={signOut}
                        className="glass-button flex items-center space-x-2 text-red-400 border-red-500/30 hover:bg-red-500/10 mx-auto md:mx-0"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 flex flex-col items-center justify-center space-y-2">
                    <div className="text-gray-400 text-sm uppercase">Top Genre</div>
                    <div className="text-3xl font-bold text-[var(--accent-primary)]">--</div>
                </div>
                <div className="glass-panel p-6 flex flex-col items-center justify-center space-y-2">
                    <div className="text-gray-400 text-sm uppercase">Minutes Listened</div>
                    <div className="text-3xl font-bold text-white">
                        {Math.floor((profile?.minutes_listened || 0) + (secondsListened / 60))}
                    </div>
                </div>
                <div className="glass-panel p-6 flex flex-col items-center justify-center space-y-2">
                    <div className="text-gray-400 text-sm uppercase">Top Artist</div>
                    <div className="text-3xl font-bold text-[var(--accent-secondary)]">--</div>
                </div>
            </div>

            {/* Removed Public Playlists Section */}
        </div>
    );
};

export default UserProfile;
