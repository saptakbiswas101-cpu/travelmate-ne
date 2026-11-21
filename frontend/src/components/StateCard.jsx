import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Shield, CheckCircle2 } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

export default function StateCard({ state }) {
  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      whileTap={{ scale: 0.985 }}
      className="h-full"
    >
      <Link
        to={`/states/${state.id}`}
        className="group relative rounded-2xl overflow-hidden halo-card flex flex-col h-full transition-all duration-300"
      >
      {/* Background Image with Gradient and Error Fallback */}
      <div className="relative aspect-[16/11] overflow-hidden bg-[#151319]">
        <img
          src={state.hero_image}
          alt={state.name}
          loading="lazy"
          onError={(e) => handleImageError(e, 'Nature')}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0B] via-[#090A0B]/40 to-transparent" />
        
        {/* Permit Badge */}
        <div className="absolute top-3 right-3">
          {state.permit_required ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md flex items-center space-x-1">
              <Shield className="w-2.5 h-2.5" />
              <span>ILP Required</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md flex items-center space-x-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>No ILP Needed</span>
            </span>
          )}
        </div>

        {/* State Capital & Tagline on Image bottom */}
        <div className="absolute bottom-3 left-4 right-4">
          <span className="text-[11px] font-semibold text-[#A2B091] tracking-wider uppercase">
            {state.nickname}
          </span>
          <h3 className="text-xl font-extrabold text-white group-hover:text-[#A2B091] transition-colors">
            {state.name}
          </h3>
          <p className="text-xs text-[#DADCD3]/80 italic">
            "{state.tagline}"
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-[#9A9E96] line-clamp-2 leading-relaxed">
          {state.description}
        </p>

        {/* Highlights */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A9E96]">
            Top Highlights
          </span>
          <div className="flex flex-wrap gap-1.5">
            {state.highlights?.slice(0, 2).map((h, i) => (
              <span key={i} className="text-[10.5px] px-2 py-0.5 rounded-md bg-[#151319] text-[#DADCD3] border border-white/5 truncate max-w-full">
                • {h}
              </span>
            ))}
          </div>
        </div>

        {/* Action Link */}
        <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#8844C9] group-hover:text-white transition">
          <span>Explore {state.name}</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
    </motion.div>
  );
}
