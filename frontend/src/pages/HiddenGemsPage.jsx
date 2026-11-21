import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, IndianRupee, ShieldCheck, Heart, Compass } from 'lucide-react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function HiddenGemsPage() {
  const [gems, setGems] = useState([]);
  const [selectedState, setSelectedState] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGems() {
      setLoading(true);
      const data = await api.getHiddenGems();
      setGems(data);
      setLoading(false);
    }
    fetchGems();
  }, []);

  const states = ['All', 'Assam', 'Arunachal Pradesh', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'];

  const filtered = selectedState === 'All' 
    ? gems 
    : gems.filter(g => g.state.toLowerCase() === selectedState.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#A2B091] uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Offbeat Expeditions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Hidden Gems of Northeast India
        </h1>
        <p className="text-sm sm:text-base text-[#9A9E96] max-w-2xl leading-relaxed">
          20+ lesser-known destinations far beyond standard tourist routes. Experience pristine eco-villages, isolated Himalayan frontiers, and sacred animist groves.
        </p>
      </div>

      {/* State Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {states.map(s => (
          <button
            key={s}
            onClick={() => setSelectedState(s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedState === s
                ? 'bg-[#8844C9] text-white shadow-halo-glow'
                : 'bg-[#151319] text-[#9A9E96] hover:text-white border border-white/5'
            }`}
          >
            {s === 'All' ? 'All States' : s}
          </button>
        ))}
      </div>

      {/* Grid of Hidden Gems */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#8844C9] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(gem => (
            <div key={gem.id} className="rounded-2xl p-6 glass-panel border border-white/10 halo-card flex flex-col justify-between space-y-5">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#8844C9]/20 text-[#A2B091] border border-[#8844C9]/30">
                    {gem.state}
                  </span>
                  <span className="text-xs text-[#A2B091] font-semibold">
                    {gem.approximate_budget}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  {gem.name}
                </h3>

                <p className="text-xs text-[#DADCD3]/90 leading-relaxed">
                  {gem.description}
                </p>

                <div className="p-3.5 rounded-xl bg-[#090A0B]/60 border border-white/5 space-y-1.5">
                  <span className="text-[10.5px] font-bold text-[#B97B34] uppercase tracking-wider block">
                    Why It's Worth Visiting:
                  </span>
                  <p className="text-xs text-[#9A9E96] leading-relaxed">
                    {gem.why_worth_visiting}
                  </p>
                </div>

                {/* Activities */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#9A9E96]">Activities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {gem.activities?.map((act, i) => (
                      <span key={i} className="text-[10.5px] px-2 py-0.5 rounded-md bg-[#151319] text-[#DADCD3] border border-white/5">
                        • {act}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Responsible Tourism Ethics Box */}
              <div className="pt-3 border-t border-white/5 space-y-1 text-xs">
                <div className="flex items-center space-x-1 text-[#A2B091] font-semibold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Responsible Travel Advice</span>
                </div>
                <p className="text-[11px] text-[#9A9E96] leading-relaxed">
                  {gem.responsible_tourism}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
