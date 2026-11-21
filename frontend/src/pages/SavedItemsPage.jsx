import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Calendar, Trash2, ArrowUpRight, Compass, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import DestinationCard from '../components/DestinationCard';

export default function SavedItemsPage() {
  const { savedDestinations, savedItineraries, toggleSaveDestination } = useAuth();
  const [activeTab, setActiveTab] = useState('destinations');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedDests() {
      setLoading(true);
      const allDests = await api.getDestinations();
      const filtered = allDests.filter(d => savedDestinations.includes(d.id));
      setDestinations(filtered);
      setLoading(false);
    }
    fetchSavedDests();
  }, [savedDestinations]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#A2B091] uppercase tracking-wider">
          <Bookmark className="w-4 h-4" />
          <span>Your Saved Collection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Saved Destinations & Itineraries
        </h1>
        <p className="text-sm text-[#9A9E96]">
          Review your bookmarked landmarks and saved AI travel itineraries anytime, online or offline.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab('destinations')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'destinations'
              ? 'bg-[#8844C9] text-white shadow-halo-glow'
              : 'bg-[#151319] text-[#9A9E96] hover:text-white border border-white/5'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Saved Destinations ({savedDestinations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('itineraries')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'itineraries'
              ? 'bg-[#8844C9] text-white shadow-halo-glow'
              : 'bg-[#151319] text-[#9A9E96] hover:text-white border border-white/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Saved Itineraries ({savedItineraries.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'destinations' ? (
        destinations.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-2xl p-8 space-y-4">
            <Bookmark className="w-10 h-10 text-[#9A9E96] mx-auto" />
            <h3 className="text-lg font-bold text-white">No saved destinations yet</h3>
            <p className="text-xs text-[#9A9E96]">Click the heart icon on any destination card to bookmark it here.</p>
            <Link to="/destinations" className="inline-block px-5 py-2.5 rounded-xl bg-[#8844C9] text-white text-xs font-bold">
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map(d => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        )
      ) : (
        savedItineraries.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-2xl p-8 space-y-4">
            <Calendar className="w-10 h-10 text-[#9A9E96] mx-auto" />
            <h3 className="text-lg font-bold text-white">No saved itineraries yet</h3>
            <p className="text-xs text-[#9A9E96]">Generate a custom journey with the AI Smart Trip Planner and click 'Save Itinerary'.</p>
            <Link to="/plan-trip" className="inline-block px-5 py-2.5 rounded-xl bg-[#8844C9] text-white text-xs font-bold">
              Launch Trip Planner
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {savedItineraries.map((plan, idx) => (
              <div key={idx} className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <span className="text-[10px] text-[#A2B091] font-bold uppercase tracking-wider">
                      {plan.total_days} Days • {plan.travel_style}
                    </span>
                    <h3 className="text-xl font-bold text-white">{plan.trip_title}</h3>
                    <p className="text-xs text-[#9A9E96]">Starting: {plan.starting_city} • {plan.travellers} Travellers</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-[#A2B091]">
                      ₹{plan.total_estimated_cost_inr?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-[#9A9E96]">
                      ₹{plan.per_person_cost_inr?.toLocaleString('en-IN')} / person
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#DADCD3]">Itinerary Route Highlights:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {plan.days?.map(d => (
                      <div key={d.day_number} className="p-2.5 rounded-xl bg-[#090A0B]/60 border border-white/5 text-xs">
                        <span className="font-bold text-[#8844C9]">Day {d.day_number}:</span> {d.destination_name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

    </div>
  );
}
