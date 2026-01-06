import React from 'react';
import { Home, Search, Library, Disc, User, Upload, Sparkles, Wind, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import MusicPlayer from './MusicPlayer';

const Layout = ({ children }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
            >
                <Icon size={20} className={isActive ? 'text-[var(--accent-primary)]' : ''} />
                <span className="font-medium text-sm">{label}</span>
            </Link>
        );
    };

    return (
        <div className="flex h-screen w-full bg-[#050505] overflow-hidden text-white relative">

            {/* Mobile Menu Button */}
            <button
                className="md:hidden absolute top-4 left-4 z-50 p-2 rounded-lg bg-white/10 text-white backdrop-blur-md border border-white/5"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <Menu size={24} />
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Glass Panel */}
            <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 h-full flex flex-col px-6 pt-6 pb-28 md:pb-6 border-r border-white/5 glass-panel md:glass-panel-none rounded-none
        transform transition-transform duration-300 ease-in-out bg-[#050505] md:bg-transparent
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

                {/* Logo */}
                <div className="flex items-center space-x-3 mb-10 px-2 pt-8 md:pt-0">
                    <img src="/logo.png" alt="Music AI" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Music AI</h1>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                    <NavItem to="/" icon={Home} label="Home" />
                    <NavItem to="/search" icon={Search} label="Search" />
                    <NavItem to="/library" icon={Library} label="Your Library" />

                    <div className="pt-6 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discover</div>
                    <NavItem to="/artists" icon={User} label="Artists" />
                    <NavItem to="/albums" icon={Disc} label="Albums" />

                    <div className="pt-6 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Features</div>
                    <NavItem to="/ai-playlist" icon={Sparkles} label="AI Playlist" />
                    <NavItem to="/meditation" icon={Wind} label="Meditation" />
                </nav>

                {/* Secondary Nav */}
                <nav className="space-y-2 mt-auto pt-6 border-t border-white/5">
                    <NavItem to="/upload" icon={Upload} label="Upload Music" />
                    <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-white/5 rounded-lg transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                <User size={14} />
                            </div>
                        </div>
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">Profile</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth w-full">
                {/* Top Gradient Overlay for depth */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[var(--accent-primary)]/10 to-transparent pointer-events-none" />

                <div className="p-8 pb-32 min-h-full pt-20 md:pt-8">
                    {children}
                </div>
            </main>

            {/* Player Bar - Glass Panel */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 h-24 glass-panel border-t border-white/10 z-50 backdrop-blur-xl bg-[#050505]/80 px-4">
                <MusicPlayer />
            </div>
        </div>
    );
};

export default Layout;
