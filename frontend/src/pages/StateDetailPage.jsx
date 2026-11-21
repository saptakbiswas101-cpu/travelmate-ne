import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Shield, CheckCircle2, ArrowRight, Utensils, Calendar, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { handleImageError } from '../utils/imageFallback';
import DestinationCard from '../components/DestinationCard';

export default function StateDetailPage() {
  const { stateId } = useParams();
  const [stateInfo, setStateInfo] = useState(null);
  const [stateDestinations, setStateDestinations] = useState([]);
  const [stateFood, setStateFood] = useState([]);
  const [stateFestivals, setStateFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStateData() {
      setLoading(true);
      const st = await api.getStateById(stateId);
      setStateInfo(st);

      if (st) {
        const [dests, foods, fests] = await Promise.all([
          api.getDestinations({ state: st.name }),
          api.getFood({ state: st.name }),
          api.getFestivals({ state: st.name })
        ]);
        setStateDestinations(dests);
        setStateFood(foods);
        setStateFestivals(fests);
      }
      setLoading(false);
    }
    fetchStateData();
  }, [stateId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="w-8 h-8 border-2 border-[#8844C9] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!stateInfo) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">State Not Found</h2>
        <Link to="/states" className="inline-block px-4 py-2 rounded-xl bg-[#8844C9] text-white text-xs font-semibold">
          Return to States
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden aspect-[21/9] max-h-[440px] border border-white/10 glass-panel shadow-2xl bg-[#151319]">
        <img 
          src={stateInfo.hero_image} 
          alt={stateInfo.name} 
          onError={(e) => handleImageError(e, 'Nature')}
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0B] via-[#090A0B]/40 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A2B091] px-3 py-1 rounded-full bg-black/60 border border-white/10">
            {stateInfo.nickname}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {stateInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#DADCD3]/80 italic">
            "{stateInfo.tagline}" • Capital: <b>{stateInfo.capital}</b>
          </p>
        </div>
      </div>

      {/* Overview and Permit Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
          <h3 className="text-lg font-bold text-white">About {stateInfo.name}</h3>
          <p className="text-xs sm:text-sm text-[#DADCD3]/90 leading-relaxed">
            {stateInfo.description}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#151319] border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#A2B091]">
            <Shield className="w-4 h-4 text-[#8844C9]" />
            <span>Permits & Entry Regulations</span>
          </div>
          <div className="text-xs text-[#DADCD3]/90 leading-relaxed">
            {stateInfo.permit_details}
          </div>
          <div className="pt-2">
            <Link
              to={`/plan-trip?state=${encodeURIComponent(stateInfo.name)}`}
              className="w-full py-2 px-3 rounded-xl bg-[#8844C9] text-white text-xs font-semibold text-center block shadow-halo-glow"
            >
              Plan Trip to {stateInfo.name}
            </Link>
          </div>
        </div>
      </div>

      {/* Destinations in this state */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">
            Top Destinations in {stateInfo.name} ({stateDestinations.length})
          </h3>
          <Link to={`/destinations?state=${encodeURIComponent(stateInfo.name)}`} className="text-xs text-[#A2B091] hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stateDestinations.map(d => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </div>

      {/* Food & Festivals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
        
        {/* Signature Dishes */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-white flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-[#8844C9]" />
            <span>Signature Cuisines</span>
          </h4>
          <div className="space-y-3">
            {stateFood.map(f => (
              <div key={f.id} className="p-3.5 rounded-xl glass-panel border border-white/5 flex items-center space-x-3">
                <img 
                  src={f.image_url} 
                  alt={f.name} 
                  onError={(e) => handleImageError(e, 'Food')}
                  className="w-14 h-14 rounded-lg object-cover shrink-0 bg-[#151319]" 
                />
                <div className="text-xs space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-white">{f.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${f.is_vegetarian ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {f.is_vegetarian ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>
                  <p className="text-[#9A9E96] line-clamp-2">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Celebrated Festivals */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#B97B34]" />
            <span>Key Festivals</span>
          </h4>
          <div className="space-y-3">
            {stateFestivals.map(fest => (
              <div key={fest.id} className="p-4 rounded-xl glass-panel border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{fest.name}</span>
                  <span className="text-[10px] text-[#A2B091] font-semibold">{fest.period}</span>
                </div>
                <p className="text-xs text-[#9A9E96] leading-relaxed">{fest.cultural_importance}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
