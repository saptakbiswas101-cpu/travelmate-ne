import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import InteractiveMap from '../components/InteractiveMap';
import { MapPin, Compass, Navigation } from 'lucide-react';

export default function InteractiveMapPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await api.getDestinations();
      setDestinations(data);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#8844C9] uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Interactive GIS Map</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Northeast India Geospatial Explorer
        </h1>
        <p className="text-sm text-[#9A9E96] max-w-2xl leading-relaxed">
          Explore all 53 verified destinations plotted on OpenStreetMap. Filter by state and category, click any pin to preview facts, and launch turn-by-turn driving directions.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#8844C9] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <InteractiveMap destinations={destinations} height="700px" initialZoom={7} />
      )}

    </div>
  );
}
