import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, IndianRupee, Heart, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageFallback';

export default function DestinationCard({ destination }) {
  const navigate = useNavigate();
  const { savedDestinations, toggleSaveDestination } = useAuth();
  const isSaved = savedDestinations.includes(destination.id);

  const categoryColors = {
    Wildlife: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Nature: 'bg-[#A2B091]/15 text-[#A2B091] border-[#A2B091]/30',
    Cultural: 'bg-[#8844C9]/15 text-purple-300 border-[#8844C9]/30',
    Historical: 'bg-[#B97B34]/15 text-amber-300 border-[#B97B34]/30',
    Spiritual: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    Adventure: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    Offbeat: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
  };

  const badgeClass = categoryColors[destination.category] || 'bg-white/10 text-white/80 border-white/20';

  const handleCardClick = () => {
    navigate(`/destinations/${destination.id}`, {
      state: { destinationPreview: destination }
    });
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      whileTap={{ scale: 0.985 }}
      onClick={handleCardClick}
      className="group relative rounded-2xl overflow-hidden halo-card flex flex-col h-full cursor-pointer select-none"
    >
      {/* Image Container with Shared Layout Animation */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#151319]">
        <motion.img
          layoutId={`destination-image-${destination.id}`}
          src={destination.image_url}
          alt={destination.name}
          loading="lazy"
          onError={(e) => handleImageError(e, destination.category)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-105"
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1]
          }}
        />

        {/* Subtle Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0B] via-transparent to-black/30 pointer-events-none" />

        {/* State Badge Top-Left */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#090A0B]/80 text-[#DADCD3] backdrop-blur-md border border-white/10 flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-[#8844C9]" />
            <span>{destination.state}</span>
          </span>
        </div>

        {/* Bookmark Button Top-Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveDestination(destination.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${isSaved
            ? 'bg-[#8844C9] text-white shadow-halo-glow'
            : 'bg-[#090A0B]/60 text-white/80 hover:text-white hover:bg-[#090A0B]'
            }`}
          title={isSaved ? 'Remove from saved' : 'Save destination'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Category Pill Bottom-Left */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-medium border backdrop-blur-md ${badgeClass}`}>
            {destination.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-white group-hover:text-[#A2B091] transition-colors leading-snug">
              {destination.name}
            </h3>
            <span className="p-1 rounded-lg text-[#9A9E96] group-hover:text-white transition">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          <p className="mt-2 text-xs text-[#9A9E96] line-clamp-2 leading-relaxed">
            {destination.short_description}
          </p>
        </div>

        {/* Meta Stats: Duration & Budget */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#DADCD3]/80">
          <div className="flex items-center space-x-1.5" title="Recommended Duration">
            <Clock className="w-3.5 h-3.5 text-[#8844C9]" />
            <span>{destination.duration}</span>
          </div>

          <div className="flex items-center space-x-1.5 font-medium text-[#A2B091]" title="Estimated Budget">
            <IndianRupee className="w-3.5 h-3.5" />
            <span className="text-[11.5px]">{destination.budget_range}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full py-2 px-3 rounded-xl bg-[#151319] group-hover:bg-[#30213D]/60 border border-white/5 group-hover:border-[#8844C9]/40 text-xs font-semibold text-center text-[#DADCD3] group-hover:text-white transition flex items-center justify-center space-x-1.5">
          <span>Explore Details</span>
          <ArrowUpRight className="w-3 h-3 text-[#A2B091]" />
        </div>
      </div>
    </motion.div>
  );
}
