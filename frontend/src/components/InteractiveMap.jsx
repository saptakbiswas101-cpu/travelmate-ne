import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, ArrowUpRight, Compass } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

// Custom Map Marker Icons using Leaflet DivIcon
const createCustomIcon = (category) => {
  const colors = {
    Wildlife: '#10B981',   // Emerald
    Nature: '#A2B091',     // Sage
    Cultural: '#8844C9',   // Violet
    Historical: '#B97B34', // Gold
    Spiritual: '#6366F1',  // Indigo
    Adventure: '#F43F5E',  // Rose
    Offbeat: '#06B6D4'     // Cyan
  };
  const color = colors[category] || '#8844C9';

  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #FFFFFF;
        box-shadow: 0 0 10px ${color}88;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: #FFFFFF;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

export default function InteractiveMap({ destinations = [], height = "600px", initialZoom = 7 }) {
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const states = ['All', 'Assam', 'Arunachal Pradesh', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'];
  const categories = ['All', 'Wildlife', 'Nature', 'Cultural', 'Historical', 'Spiritual', 'Adventure', 'Offbeat'];

  const filtered = destinations.filter(d => {
    const matchState = selectedState === 'All' || d.state.toLowerCase() === selectedState.toLowerCase();
    const matchCat = selectedCategory === 'All' || d.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchState && matchCat && d.latitude && d.longitude;
  });

  // Northeast India center coordinates
  const center = [26.15, 92.8];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 glass-panel shadow-2xl flex flex-col">
      
      {/* Map Control Toolbar */}
      <div className="p-4 bg-[#151319]/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-[#8844C9]" />
          <span className="text-sm font-bold text-white tracking-wide">
            Interactive Northeast Geospatial Map
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#8844C9]/20 text-[#A2B091] font-semibold border border-[#8844C9]/30">
            {filtered.length} Locations Plotted
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl bg-[#090A0B] border border-white/10 text-[#DADCD3] focus:outline-none focus:border-[#8844C9]"
          >
            {states.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All 8 States' : s}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl bg-[#090A0B] border border-white/10 text-[#DADCD3] focus:outline-none focus:border-[#8844C9]"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Body */}
      <div style={{ height }} className="w-full relative z-10">
        <MapContainer
          center={center}
          zoom={initialZoom}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          {/* Official Free OpenStreetMap TileLayer — Zero API Key Required */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.map((dest) => (
            <Marker
              key={dest.id}
              position={[dest.latitude, dest.longitude]}
              icon={createCustomIcon(dest.category)}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[220px] max-w-[260px]">
                  <div className="w-full h-28 rounded-lg overflow-hidden mb-2 relative bg-[#151319]">
                    <img 
                      src={dest.image_url} 
                      alt={dest.name} 
                      onError={(e) => handleImageError(e, dest.category)}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-black/75 text-[#A2B091]">
                      {dest.state}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white leading-tight mb-1">
                    {dest.name}
                  </h4>
                  <p className="text-[11px] text-[#9A9E96] line-clamp-2 mb-2 leading-relaxed">
                    {dest.short_description}
                  </p>

                  <div className="text-[10px] text-[#DADCD3] space-y-0.5 pb-2 mb-2 border-b border-white/10">
                    <div><b>Best Season:</b> {dest.best_season}</div>
                    <div><b>Est. Budget:</b> {dest.budget_range}</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/destinations/${dest.id}`}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-[#8844C9] text-white text-[11px] font-bold text-center flex items-center justify-center space-x-1 hover:bg-[#9d55e0] transition"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${dest.latitude},${dest.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1.5 px-2 rounded-lg bg-[#151319] border border-white/10 text-[11px] text-[#DADCD3] hover:text-white hover:bg-white/5 transition flex items-center justify-center space-x-1"
                      title="Open Directions in Google Maps"
                    >
                      <Navigation className="w-3 h-3 text-[#A2B091]" />
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}
