import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  IndianRupee, 
  ShieldAlert, 
  Navigation, 
  Heart, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Compass, 
  Share2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { handleImageError } from '../utils/imageFallback';

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export default function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { savedDestinations, toggleSaveDestination } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // Initialize synchronously with state passed from the card or local cache to allow instant shared layoutId transition!
  const [destination, setDestination] = useState(() => {
    if (location.state?.destinationPreview) return location.state.destinationPreview;
    return api.getDestinationByIdSync(id) || null;
  });
  const [loading, setLoading] = useState(!destination);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      const data = await api.getDestinationById(id);
      if (data) setDestination(data);
      setLoading(false);
    }
    fetchDetail();
  }, [id]);

  if (loading && !destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#8844C9] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#9A9E96]">Retrieving destination profile...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Destination Not Found</h2>
        <p className="text-xs text-[#9A9E96]">The destination ID '{id}' could not be located.</p>
        <Link to="/destinations" className="inline-block px-4 py-2 rounded-xl bg-[#8844C9] text-white text-xs font-semibold">
          Return to Destinations
        </Link>
      </div>
    );
  }

  const isSaved = savedDestinations.includes(destination.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const pinIcon = L.divIcon({
    className: 'custom-pin',
    html: `
      <div style="
        background-color: #8844C9;
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #FFFFFF;
        box-shadow: 0 0 12px #8844C9;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 10px; height: 10px; background: #FFFFFF; border-radius: 50%; transform: rotate(45deg);"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28]
  });

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10"
    >
      {/* Top Navigation */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-xs font-semibold text-[#9A9E96] hover:text-white transition group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Explore</span>
        </button>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-[#151319] hover:bg-white/5 border border-white/10 text-[#DADCD3] text-xs flex items-center space-x-1.5 transition"
            title="Share destination"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => toggleSaveDestination(destination.id)}
            className={`p-2.5 rounded-xl border transition flex items-center space-x-1.5 ${
              isSaved 
                ? 'bg-[#8844C9] text-white border-[#8844C9] shadow-halo-glow' 
                : 'bg-[#151319] text-[#DADCD3] hover:text-white border-white/10'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span className="text-xs hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 1. Hero Image with Shared layoutId Transition */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 glass-panel shadow-2xl aspect-[16/9] sm:aspect-[21/9] max-h-[520px] bg-[#151319]">
        <motion.img
          layoutId={`destination-image-${destination.id}`}
          src={destination.image_url}
          alt={destination.name}
          onError={(e) => handleImageError(e, destination.category)}
          className="w-full h-full object-cover"
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1]
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0B] via-[#090A0B]/40 to-transparent pointer-events-none" />

        {/* 2 & 3. Title, State & Category Information */}
        <motion.div 
          variants={itemVariants} 
          className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 space-y-2 pointer-events-auto"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8844C9]/60 text-[#A2B091] backdrop-blur-md border border-[#8844C9]/40">
              {destination.state}
            </span>
            {destination.district && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-[#DADCD3] backdrop-blur-md border border-white/10">
                {destination.district} District
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/20">
              {destination.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            {destination.name}
          </h1>
          <p className="text-xs sm:text-base text-[#DADCD3]/90 max-w-2xl leading-relaxed drop-shadow">
            {destination.short_description}
          </p>
        </motion.div>
      </div>

      {/* 4. Quick Facts & Budget Bar */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#9A9E96]">
            <Calendar className="w-4 h-4 text-[#8844C9]" />
            <span>Best Season</span>
          </div>
          <div className="text-sm font-bold text-white">{destination.best_season}</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#9A9E96]">
            <Clock className="w-4 h-4 text-[#8844C9]" />
            <span>Duration</span>
          </div>
          <div className="text-sm font-bold text-white">{destination.duration}</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#9A9E96]">
            <IndianRupee className="w-4 h-4 text-[#A2B091]" />
            <span>Budget Estimate</span>
          </div>
          <div className="text-sm font-bold text-[#A2B091]">{destination.budget_range}</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#9A9E96]">
            <Compass className="w-4 h-4 text-[#B97B34]" />
            <span>Coordinates</span>
          </div>
          <div className="text-sm font-bold text-white">
            {destination.latitude?.toFixed(4)}° N, {destination.longitude?.toFixed(4)}° E
          </div>
        </div>
      </motion.div>

      {/* Main Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Description, Highlights, Precautions, Accessibility */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 5. Detailed Description */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-xl font-bold text-white">About {destination.name}</h3>
            <p className="text-sm text-[#DADCD3]/90 leading-relaxed whitespace-pre-line">
              {destination.detailed_description}
            </p>
          </motion.div>

          {/* 6. Highlights & Activities */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-xl font-bold text-white">Recommended Activities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {destination.activities?.map((act, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#090A0B]/60 border border-white/5 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A2B091] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#DADCD3] font-medium">{act}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 7. Travel Precautions Alert Box */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
            <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>Important Travel Precautions & Permits</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {destination.precautions}
            </p>
          </motion.div>

          {/* 8. Accessibility & Transit Guide */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-[#8844C9]" />
              <span>How to Reach & Accessibility</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#9A9E96] leading-relaxed">
              {destination.accessibility}
            </p>
          </motion.div>

        </div>

        {/* Right Sidebar: Mini Interactive Map & Trip Planner CTA */}
        <motion.div variants={itemVariants} className="space-y-6">
          
          {/* Mini Interactive Map with Zero API Key OpenStreetMap */}
          <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden shadow-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Geographic Location</span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#A2B091] hover:underline flex items-center space-x-1"
              >
                <span>Google Maps</span>
                <Navigation className="w-3 h-3" />
              </a>
            </div>

            <div className="h-56 rounded-xl overflow-hidden relative">
              <MapContainer
                center={[destination.latitude, destination.longitude]}
                zoom={10}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[destination.latitude, destination.longitude]} icon={pinIcon}>
                  <Popup>{destination.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Suitable Traveller Types */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
            <span className="text-xs font-bold text-white">Best Suited For</span>
            <div className="flex flex-wrap gap-1.5">
              {destination.traveller_types?.map((t, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-[#151319] border border-white/5 text-xs text-[#DADCD3]">
                  • {t}
                </span>
              ))}
            </div>
          </div>

          {/* Plan Trip CTA Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#30213D] via-[#151319] to-[#090A0B] border border-[#8844C9]/40 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A2B091]">AI Assistant</span>
              <h4 className="text-lg font-bold text-white">Include in Itinerary</h4>
              <p className="text-xs text-[#9A9E96]">
                Generate an AI-optimized journey visiting {destination.name} alongside matching circuit highlights.
              </p>
            </div>

            <Link
              to={`/plan-trip?destination=${encodeURIComponent(destination.name)}&state=${encodeURIComponent(destination.state)}`}
              className="w-full py-3 rounded-xl bg-[#8844C9] hover:bg-[#9d55e0] text-white text-xs font-bold text-center flex items-center justify-center space-x-2 shadow-halo-glow transition"
            >
              <Sparkles className="w-4 h-4 text-[#A2B091]" />
              <span>Plan Trip with this Destination</span>
            </Link>
          </div>

        </motion.div>

      </div>

    </motion.div>
  );
}
