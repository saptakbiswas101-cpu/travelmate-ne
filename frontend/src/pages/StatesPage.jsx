import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StateCard from '../components/StateCard';
import { MapPin, Shield } from 'lucide-react';

export default function StatesPage() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStates() {
      const data = await api.getStates();
      setStates(data);
      setLoading(false);
    }
    loadStates();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#8844C9] uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>The Eight Sisters</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore the Eight States of Northeast India
        </h1>
        <p className="text-sm sm:text-base text-[#9A9E96] max-w-2xl leading-relaxed">
          From the tea valleys of Assam and Himalayan ridges of Arunachal, to the living root bridges of Meghalaya and floating islands of Manipur.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#8844C9] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {states.map(st => (
            <StateCard key={st.id} state={st} />
          ))}
        </div>
      )}

    </div>
  );
}
