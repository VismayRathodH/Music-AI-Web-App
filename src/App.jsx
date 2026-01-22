import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import Upload from './pages/Upload';
import AIPlaylist from './pages/AIPlaylist';
import Meditation from './pages/Meditation';

import Albums from './pages/Albums';
import Library from './pages/Library';
import UserProfile from './pages/UserProfile';
import ForgotPassword from './pages/ForgotPassword';
import AboutUs from './pages/AboutUs';
import FullScreenPlayer from './components/FullScreenPlayer';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext'; // Import PlayerProvider
import ProtectedRoute from './components/ProtectedRoute'; // Import wrapper

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about" element={<AboutUs />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />


            <Route path="/albums" element={<ProtectedRoute><Albums /></ProtectedRoute>} />

            <Route path="/ai-playlist" element={<ProtectedRoute><AIPlaylist /></ProtectedRoute>} />
            <Route path="/meditation" element={<ProtectedRoute><Meditation /></ProtectedRoute>} />

            {/* Full Screen Player Route */}
            <Route path="/player" element={<ProtectedRoute><FullScreenPlayer /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
