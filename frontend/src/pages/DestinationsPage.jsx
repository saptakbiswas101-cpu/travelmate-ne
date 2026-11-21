import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, X } from 'lucide-react';
import { api } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import DestinationCardSkeleton from '../components/DestinationCardSkeleton';

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('popularity');

  const states = ['All', 'Assam', 'Arunachal Pradesh', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'];
  const categories = ['All', 'Wildlife', 'Nature', 'Cultural', 'Historical', 'Spiritual', 'Adventure', 'Offbeat'];

  useEffect(() => {
    async function fetchDestinations() {
      setLoading(true);
      const data = await api.getDestinations({
        search: search.trim() || undefined,
        state: selectedState !== 'All' ? selectedState : undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        sort_by: sortBy === 'name' ? 'name' : sortBy === 'state' ? 'state' : undefined
      });
      setDestinations(data);
      setLoading(false);
    }
    fetchDestinations();
  }, [search, selectedState, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedState('All');
    setSelectedCategory('All');
    setSortBy('popularity');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#8844C9] uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Regional Explorer</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore Destinations across Northeast India
        </h1>
        <p className="text-sm sm:text-base text-[#9A9E96] max-w-2xl leading-relaxed">
          Filter through 50+ curated destinations across all eight states. Discover national parks, ancient river islands, high-altitude passes, and cultural centers.
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4 shadow-xl">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#8844C9] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by destination name, district, or landmark..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#090A0B] border border-white/10 text-white placeholder-[#9A9E96] text-sm focus:outline-none focus:border-[#8844C9] transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3 text-[#9A9E96] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters and Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          {/* State Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#9A9E96] uppercase mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#090A0B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#8844C9]"
            >
              {states.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All 8 States' : s}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#9A9E96] uppercase mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#090A0B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#8844C9]"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-[#9A9E96] uppercase mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#090A0B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#8844C9]"
            >
              <option value="popularity">Popularity / Default</option>
              <option value="name">Name (A-Z)</option>
              <option value="state">State (A-Z)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearFilters}
              className="w-full py-2 px-3 rounded-xl bg-[#151319] hover:bg-white/5 border border-white/10 text-xs text-[#DADCD3] font-semibold transition"
            >
              Reset All Filters
            </motion.button>
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#9A9E96]">
        <span>Showing <b className="text-white">{destinations.length}</b> verified destinations</span>
        {(selectedState !== 'All' || selectedCategory !== 'All' || search) && (
          <span className="text-[#A2B091] font-medium">Active filters applied</span>
        )}
      </div>

      {/* Grid of Destination Cards with Skeletons and Smooth Transition */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-20 text-center glass-panel rounded-2xl p-8 space-y-4"
        >
          <p className="text-base text-white font-semibold">No destinations match your search criteria.</p>
          <p className="text-xs text-[#9A9E96]">Try adjusting state, category, or search term keywords.</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-[#8844C9] text-white text-xs font-semibold shadow-halo-glow"
          >
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </motion.div>
      )}

    </div>
  );
}
