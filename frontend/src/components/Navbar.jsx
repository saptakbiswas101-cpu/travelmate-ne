import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Bookmark, 
  Calculator, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Map as MapIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GamusaBanner from './GamusaBanner';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, setIsAuthModalOpen, savedDestinations } = useAuth();

  const navLinks = [
    { label: 'Explore', path: '/destinations', icon: Compass },
    { label: '8 States', path: '/states', icon: MapPin },
    { label: 'Hidden Gems', path: '/hidden-gems', icon: Sparkles },
    { label: 'Culture & Food', path: '/culture', icon: Calendar },
    { label: 'AI Planner', path: '/plan-trip', icon: Sparkles, highlight: true },
    { label: 'Budget Calc', path: '/budget-calculator', icon: Calculator },
    { label: 'Live Map', path: '/map', icon: MapIcon }
  ];

  const isActive = (p) => location.pathname === p || (p !== '/' && location.pathname.startsWith(p));

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#090A0B]/80 border-b border-white/5 transition-all">
      <GamusaBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#30213D] via-[#8844C9] to-[#B97B34] p-0.5 shadow-halo-glow transition-transform duration-300"
            >
              <div className="w-full h-full bg-[#090A0B] rounded-[10px] flex items-center justify-center">
                <span className="text-xl font-bold gold-gradient-text tracking-tighter">TM</span>
              </div>
            </motion.div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#A2B091] transition-colors">
                  TravelMate<span className="text-[#8844C9]">NE</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-[#8844C9]/20 text-[#A2B091] border border-[#8844C9]/30">
                  Northeast
                </span>
              </div>
              <p className="text-[10.5px] text-[#9A9E96] tracking-wide hidden sm:block">
                Beyond the ordinary.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links with Shared layoutId Indicator */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    active
                      ? 'text-white'
                      : item.highlight
                      ? 'text-[#A2B091] hover:text-white hover:bg-[#151319]'
                      : 'text-[#DADCD3]/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {/* Active Indicator Pill */}
                  {active && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-[#30213D]/70 border border-[#8844C9]/40 rounded-xl -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 ${active ? 'text-[#8844C9]' : item.highlight ? 'text-[#A2B091]' : 'text-[#9A9E96]'}`} />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Saved Destinations Badge */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/saved"
                className="relative p-2.5 rounded-xl bg-[#151319] hover:bg-[#30213D]/40 border border-white/5 hover:border-[#8844C9]/30 text-[#DADCD3] transition-all flex items-center justify-center"
                title="Saved destinations and itineraries"
              >
                <Bookmark className="w-4 h-4 text-[#A2B091]" />
                {savedDestinations.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#8844C9] text-white text-[10px] font-bold flex items-center justify-center shadow-halo-glow">
                    {savedDestinations.length}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
                <Link
                  to="/saved"
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#151319] border border-white/5 text-sm font-medium hover:border-[#8844C9]/30 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#8844C9] to-[#B97B34] flex items-center justify-center text-[11px] font-bold text-white">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs text-[#DADCD3] truncate max-w-[100px]">{user.full_name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-[#9A9E96] hover:text-white hover:bg-white/5 transition"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8844C9] to-[#30213D] hover:from-[#9d55e0] hover:to-[#432d56] text-white text-sm font-semibold shadow-halo-glow transition-all duration-300"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/saved"
              className="relative p-2 rounded-lg bg-[#151319] border border-white/10 text-[#DADCD3]"
            >
              <Bookmark className="w-4 h-4 text-[#A2B091]" />
              {savedDestinations.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8844C9] text-white text-[9px] font-bold flex items-center justify-center">
                  {savedDestinations.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-[#151319] border border-white/10 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu with AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-[#090A0B]/95 border-b border-white/10 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl"
          >
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-medium ${
                    active ? 'bg-[#30213D] text-white' : 'text-[#DADCD3] hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-[#8844C9]' : 'text-[#A2B091]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <div className="pt-3 border-t border-white/10">
              {user ? (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#DADCD3]">Signed in as <b>{user.full_name}</b></span>
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8844C9] to-[#30213D] text-white font-semibold text-center text-sm shadow-halo-glow"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
