import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // If supabase is not initialized (missing env vars), nothing to do
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Check active session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        signUp: async (data) => {
            if (!supabase) throw new Error("Backend not configured");
            return supabase.auth.signUp(data);
        },
        signIn: async (data) => {
            if (!supabase) throw new Error("Backend not configured");
            return supabase.auth.signInWithPassword(data);
        },
        signOut: async () => {
            if (supabase) await supabase.auth.signOut();
            navigate('/login');
        },
        user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
