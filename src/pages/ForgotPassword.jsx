import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="glass-panel p-8 w-full max-w-md relative overflow-hidden text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Reset Password</h2>
                <p className="text-gray-400 mb-8 text-sm">Enter your email address and we'll send you a link to reset your password.</p>

                <form className="space-y-6 text-left">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--accent-primary)] transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent-primary)] focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>

                    <button className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2">
                        <span>Send Reset Link</span>
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-6">
                    <Link to="/login" className="text-sm text-gray-500 hover:text-white transition-colors">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
