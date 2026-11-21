import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Shield, Sparkles, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import GamusaBanner from './GamusaBanner';

export default function Footer() {
  const states = [
    { name: 'Assam', path: '/states/assam' },
    { name: 'Arunachal Pradesh', path: '/states/arunachal-pradesh' },
    { name: 'Meghalaya', path: '/states/meghalaya' },
    { name: 'Manipur', path: '/states/manipur' },
    { name: 'Mizoram', path: '/states/mizoram' },
    { name: 'Nagaland', path: '/states/nagaland' },
    { name: 'Tripura', path: '/states/tripura' },
    { name: 'Sikkim', path: '/states/sikkim' }
  ];

  return (
    <footer className="relative bg-[#090A0B] border-t border-white/5 pt-16 pb-12 overflow-hidden">
      <GamusaBanner className="mb-12" />

      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8844C9]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#B97B34]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#30213D] to-[#8844C9] p-0.5">
                <div className="w-full h-full bg-[#090A0B] rounded-[10px] flex items-center justify-center">
                  <span className="text-lg font-bold gold-gradient-text">TM</span>
                </div>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                TravelMate<span className="text-[#8844C9]">NE</span>
              </span>
            </Link>
            
            <p className="text-sm text-[#9A9E96] leading-relaxed max-w-sm">
              Making tourism across the eight sister states of Northeast India accessible, sustainable, and unforgettable. Powered by AI and verified regional knowledge.
            </p>

            <div className="pt-2 flex items-center space-x-2 text-xs text-[#A2B091]">
              <span className="w-2 h-2 rounded-full bg-[#A2B091] animate-pulse" />
              <span>Dedicated to responsible & community-led tourism</span>
            </div>
          </div>

          {/* All 8 States */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#DADCD3] mb-4 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#8844C9]" />
              <span>Explore 8 States</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9A9E96]">
              {states.map((st) => (
                <li key={st.name}>
                  <Link to={st.path} className="hover:text-white hover:translate-x-1 inline-flex items-center transition-all">
                    <span>{st.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Features */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#DADCD3] mb-4 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-[#B97B34]" />
              <span>Platform</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9A9E96]">
              <li><Link to="/destinations" className="hover:text-white transition">Destination Discovery</Link></li>
              <li><Link to="/hidden-gems" className="hover:text-white transition">Offbeat Hidden Gems</Link></li>
              <li><Link to="/culture" className="hover:text-white transition">Cuisine & Festivals</Link></li>
              <li><Link to="/plan-trip" className="hover:text-white text-[#A2B091] font-medium transition">AI Itinerary Planner</Link></li>
              <li><Link to="/budget-calculator" className="hover:text-white transition">Trip Cost Calculator</Link></li>
              <li><Link to="/map" className="hover:text-white transition">Interactive OpenStreetMap</Link></li>
            </ul>
          </div>

          {/* Official Resources & Permits */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#DADCD3] mb-4 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#A2B091]" />
              <span>Permits & Info</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9A9E96]">
              <li>
                <a href="https://arunachalilp.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1 transition">
                  <span>Arunachal ILP Portal</span>
                  <ExternalLink className="w-3 h-3 text-[#9A9E96]" />
                </a>
              </li>
              <li>
                <a href="https://ilp.nagaland.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1 transition">
                  <span>Nagaland ILP Portal</span>
                  <ExternalLink className="w-3 h-3 text-[#9A9E96]" />
                </a>
              </li>
              <li>
                <a href="https://ilp.mizoram.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1 transition">
                  <span>Mizoram ILP Portal</span>
                  <ExternalLink className="w-3 h-3 text-[#9A9E96]" />
                </a>
              </li>
              <li>
                <a href="https://manipurilponline.mn.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1 transition">
                  <span>Manipur ILP Portal</span>
                  <ExternalLink className="w-3 h-3 text-[#9A9E96]" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#9A9E96]/80 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} TravelMateNE. Designed with reverence for the peoples, lands, and cultures of Northeast India.</p>
          <div className="p-2.5 rounded-lg bg-[#151319] border border-white/5 text-[11px] text-[#A2B091] max-w-md text-center md:text-right">
            <b>Disclaimer:</b> All budgets, itineraries, and rates are realistic illustrative estimates. Always verify local weather, road status, and forest permits before travel.
          </div>
        </div>

      </div>
    </footer>
  );
}
