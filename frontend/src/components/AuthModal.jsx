import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!fullName.trim()) {
          setError('Please enter your name.');
          setLoading(false);
          return;
        }
        const res = await register(email, password, fullName);
        if (res.success) {
          setIsAuthModalOpen(false);
        } else {
          setError(res.error || 'Registration failed.');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          setIsAuthModalOpen(false);
        } else {
          setError(res.error || 'Invalid credentials.');
        }
      }
    } catch (err) {
      setError('Something went wrong. Try demo sign in.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@travelmatene.com');
    setPassword('northeast2026');
    setIsRegisterMode(false);
    setError('');
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Glow Element */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#8844C9]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-[#9A9E96] hover:text-white hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="space-y-1 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A2B091]">
                TravelMateNE Pass
              </span>
              <h3 className="text-2xl font-extrabold text-white">
                {isRegisterMode ? 'Join TravelMateNE' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-[#9A9E96]">
                {isRegisterMode 
                  ? 'Save custom itineraries, bookmark hidden gems and sync travel notes.' 
                  : 'Access your saved Northeast destinations and custom AI itineraries.'
                }
              </p>
            </div>

            {/* 1-Click Demo Shortcut */}
            <div className="mb-5 p-3 rounded-xl bg-[#30213D]/40 border border-[#8844C9]/30 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-white block">Hackathon Evaluator?</span>
                <span className="text-[11px] text-[#A2B091]">Pre-filled demo account ready</span>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={fillDemo}
                className="px-3 py-1.5 rounded-lg bg-[#8844C9] hover:bg-[#9d55e0] text-white text-xs font-bold transition flex items-center space-x-1 shadow-halo-glow"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#A2B091]" />
                <span>1-Click Fill</span>
              </motion.button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegisterMode && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#DADCD3]">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#9A9E96] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Saptak Biswas"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#090A0B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#8844C9]"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#DADCD3]">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9A9E96] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="traveler@northeast.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#090A0B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#8844C9]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#DADCD3]">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9A9E96] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#090A0B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#8844C9]"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-[#8844C9] hover:bg-[#9d55e0] text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-halo-glow disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{isRegisterMode ? 'Create Account' : 'Sign In to TravelMateNE'}</span>
                )}
              </motion.button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-[#9A9E96]">
              {isRegisterMode ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegisterMode(false); setError(''); }}
                    className="text-[#A2B091] hover:underline font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegisterMode(true); setError(''); }}
                    className="text-[#A2B091] hover:underline font-semibold"
                  >
                    Create Account
                  </button>
                </p>
              )}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
