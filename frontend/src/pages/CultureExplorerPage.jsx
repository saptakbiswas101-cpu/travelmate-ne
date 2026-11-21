import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { Utensils, Calendar, MapPin, Sparkles, Leaf, Info } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

export default function CultureExplorerPage() {
  const [activeTab, setActiveTab] = useState('food'); // 'food' or 'festivals'
  const [foodItems, setFoodItems] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [selectedState, setSelectedState] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCultureData() {
      setLoading(true);
      const [foods, fests] = await Promise.all([
        api.getFood(),
        api.getFestivals()
      ]);
      setFoodItems(foods);
      setFestivals(fests);
      setLoading(false);
    }
    loadCultureData();
  }, []);

  const states = ['All', 'Assam', 'Arunachal Pradesh', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'];

  const filteredFood = foodItems.filter(f => {
    const matchState = selectedState === 'All' || f.state.toLowerCase() === selectedState.toLowerCase();
    const matchVeg = !vegOnly || f.is_vegetarian;
    return matchState && matchVeg;
  });

  const filteredFestivals = festivals.filter(fest => {
    return selectedState === 'All' || fest.state.toLowerCase() === selectedState.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#8844C9] uppercase tracking-wider px-3 py-1 rounded-full bg-[#8844C9]/20 border border-[#8844C9]/40">
          <Sparkles className="w-4 h-4 text-[#A2B091]" />
          <span>Cultural Heritage</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Northeast Culture, Food & Festivals
        </h1>
        <p className="text-sm sm:text-base text-[#9A9E96] leading-relaxed">
          Accurate, respectful portrayals of indigenous cuisines, harvest celebrations, Muga silk traditions, and classical arts across all eight states.
        </p>
      </div>

      {/* Tabs Switcher with Shared layoutId */}
      <div className="flex items-center justify-center space-x-3">
        <button
          onClick={() => setActiveTab('food')}
          className={`relative flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors ${
            activeTab === 'food'
              ? 'text-white'
              : 'text-[#9A9E96] hover:text-white bg-[#151319] border border-white/5'
          }`}
        >
          {activeTab === 'food' && (
            <motion.div
              layoutId="activeCultureTab"
              className="absolute inset-0 bg-[#8844C9] rounded-xl shadow-halo-glow -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <Utensils className="w-4 h-4" />
          <span className="relative z-10">Traditional Food ({foodItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('festivals')}
          className={`relative flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors ${
            activeTab === 'festivals'
              ? 'text-white'
              : 'text-[#9A9E96] hover:text-white bg-[#151319] border border-white/5'
          }`}
        >
          {activeTab === 'festivals' && (
            <motion.div
              layoutId="activeCultureTab"
              className="absolute inset-0 bg-[#8844C9] rounded-xl shadow-halo-glow -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <Calendar className="w-4 h-4" />
          <span className="relative z-10">Festivals & Celebrations ({festivals.length})</span>
        </button>
      </div>

      {/* State & Veg Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {states.map(s => (
            <button
              key={s}
              onClick={() => setSelectedState(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedState === s
                  ? 'bg-[#30213D] text-white border border-[#8844C9]'
                  : 'bg-[#090A0B] text-[#9A9E96] hover:text-white border border-white/5'
              }`}
            >
              {s === 'All' ? 'All States' : s}
            </button>
          ))}
        </div>

        {activeTab === 'food' && (
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition ${
              vegOnly 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-[#090A0B] text-[#9A9E96] border-white/5'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Vegetarian Only</span>
          </button>
        )}
      </div>

      {/* Content Rendering with Animated Cross-fade */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#8844C9] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'food' ? (
            /* Food Catalog */
            <motion.div
              key="food-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredFood.map(f => (
                <motion.div
                  key={f.id}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="rounded-2xl overflow-hidden glass-panel border border-white/10 halo-card flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] bg-[#151319] overflow-hidden relative">
                    <img 
                      src={f.image_url} 
                      alt={f.name} 
                      onError={(e) => handleImageError(e, 'Food')}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                    />
                    <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                      f.is_vegetarian 
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 backdrop-blur-md' 
                        : 'bg-rose-500/30 text-rose-300 border border-rose-500/40 backdrop-blur-md'
                    }`}>
                      {f.is_vegetarian ? 'Veg' : 'Non-Veg'}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white">
                      {f.state}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A2B091]">
                        {f.community} Tradition
                      </span>
                      <h4 className="text-base font-bold text-white">{f.name}</h4>
                      <p className="text-xs text-[#9A9E96] line-clamp-3 leading-relaxed">
                        {f.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-1 text-[11px] text-[#DADCD3]/80">
                      <div><b className="text-white">Taste:</b> {f.taste_profile}</div>
                      <div><b className="text-white">Ingredients:</b> {f.ingredients?.slice(0, 3).join(', ')}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Festivals Catalog */
            <motion.div
              key="festivals-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredFestivals.map(fest => (
                <motion.div
                  key={fest.id}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="p-6 rounded-2xl glass-panel border border-white/10 halo-card flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8844C9] uppercase flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{fest.state}</span>
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        fest.is_fixed_date 
                          ? 'bg-[#151319] text-[#A2B091] border-[#A2B091]/30' 
                          : 'bg-[#151319] text-amber-300 border-amber-500/30'
                      }`}>
                        {fest.is_fixed_date ? 'Fixed Annual Date' : 'Lunar / Seasonal'}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-white">{fest.name}</h4>
                    <div className="text-xs text-[#DADCD3] font-medium flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#A2B091]" />
                      <span>{fest.period}</span>
                    </div>
                    <p className="text-xs text-[#9A9E96] leading-relaxed pt-1">
                      {fest.cultural_importance}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A9E96]">
                      Cultural Highlights
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fest.highlights?.map((h, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-[#151319] border border-white/5 text-[#DADCD3]">
                          • {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

    </div>
  );
}
