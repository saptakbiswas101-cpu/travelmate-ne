import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  IndianRupee, 
  Users, 
  Calendar, 
  Building, 
  Car, 
  Utensils, 
  Activity, 
  TrendingDown, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

export default function BudgetCalculatorPage() {
  const [days, setDays] = useState(6);
  const [people, setPeople] = useState(2);
  const [tier, setTier] = useState('mid_range');
  const [transport, setTransport] = useState('private_cab');
  const [food, setFood] = useState('standard_restaurants');
  const [activity, setActivity] = useState('moderate');
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await api.calculateBudget({
        travel_days: parseInt(days),
        traveller_count: parseInt(people),
        accommodation_tier: tier,
        transport_type: transport,
        food_preference: food,
        activity_level: activity
      });
      setCalculation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [days, people, tier, transport, food, activity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#A2B091] uppercase tracking-wider px-3 py-1 rounded-full bg-[#8844C9]/20 border border-[#8844C9]/40">
          <Calculator className="w-4 h-4 text-[#8844C9]" />
          <span>Interactive Estimation Tool</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Northeast India Budget Calculator
        </h1>
        <p className="text-sm sm:text-base text-[#9A9E96] leading-relaxed">
          Estimate realistic trip expenses across accommodation, mountain cabs, food, forest permits, and activities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Controls & Sliders (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
          
          <h3 className="text-xl font-bold text-white">Trip Parameters</h3>

          {/* Days & Group Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#DADCD3] flex items-center justify-between">
                <span>Trip Duration</span>
                <span className="font-bold text-[#A2B091]">{days} Days</span>
              </label>
              <input
                type="range"
                min="2"
                max="21"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full accent-[#8844C9] bg-[#090A0B] h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#DADCD3] flex items-center justify-between">
                <span>Number of Travellers</span>
                <span className="font-bold text-[#A2B091]">{people} Person{people > 1 ? 's' : ''}</span>
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full accent-[#8844C9] bg-[#090A0B] h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Accommodation Tier */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-[#DADCD3]">Accommodation Tier</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'budget', label: 'Backpacker / Homestay', desc: '₹950/night avg' },
                { id: 'mid_range', label: 'Comfort Boutique', desc: '₹3,200/night avg' },
                { id: 'luxury', label: 'Luxury Heritage', desc: '₹9,500/night avg' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTier(opt.id)}
                  className={`p-3 rounded-xl text-left border transition text-xs ${
                    tier === opt.id 
                      ? 'bg-[#30213D] text-white border-[#8844C9] shadow-halo-glow font-bold' 
                      : 'bg-[#090A0B] text-[#9A9E96] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="text-white font-semibold">{opt.label}</div>
                  <div className="text-[11px] text-[#A2B091] mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Transport Mode */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-[#DADCD3]">Transportation Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'public_shared', label: 'Shared Sumos / Buses', desc: 'Most budget-friendly' },
                { id: 'private_cab', label: 'Private Mountain Cab', desc: 'Dedicated SUV + Driver' },
                { id: 'self_drive', label: 'Self-Drive SUV / Bike', desc: 'Rental vehicle + fuel' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTransport(opt.id)}
                  className={`p-3 rounded-xl text-left border transition text-xs ${
                    transport === opt.id 
                      ? 'bg-[#30213D] text-white border-[#8844C9] shadow-halo-glow font-bold' 
                      : 'bg-[#090A0B] text-[#9A9E96] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="text-white font-semibold">{opt.label}</div>
                  <div className="text-[11px] text-[#A2B091] mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Food Preference */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-[#DADCD3]">Dining Preference</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'local_eateries', label: 'Local Dhabas & Thalis', desc: '₹450/day per person' },
                { id: 'standard_restaurants', label: 'Standard Dining', desc: '₹1,100/day per person' },
                { id: 'fine_dining', label: 'Fine Dining / Resorts', desc: '₹2,600/day per person' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFood(opt.id)}
                  className={`p-3 rounded-xl text-left border transition text-xs ${
                    food === opt.id 
                      ? 'bg-[#30213D] text-white border-[#8844C9] shadow-halo-glow font-bold' 
                      : 'bg-[#090A0B] text-[#9A9E96] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="text-white font-semibold">{opt.label}</div>
                  <div className="text-[11px] text-[#A2B091] mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Intensity */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-[#DADCD3]">Activity Level & Safaris</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'relaxed', label: 'Relaxed Sightseeing', desc: 'Free viewpoints & walks' },
                { id: 'moderate', label: 'Moderate Sightseeing', desc: 'Village guides, entry passes' },
                { id: 'active', label: 'High Adventure / Safaris', desc: 'Jeep & Elephant safaris, ILP' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActivity(opt.id)}
                  className={`p-3 rounded-xl text-left border transition text-xs ${
                    activity === opt.id 
                      ? 'bg-[#30213D] text-white border-[#8844C9] shadow-halo-glow font-bold' 
                      : 'bg-[#090A0B] text-[#9A9E96] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="text-white font-semibold">{opt.label}</div>
                  <div className="text-[11px] text-[#A2B091] mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Dynamic Financial Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {calculation ? (
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#8844C9]/40 space-y-6 sticky top-28 shadow-2xl">
              
              <div className="space-y-1 border-b border-white/5 pb-4">
                <span className="text-[11px] uppercase font-bold text-[#A2B091] tracking-wider">
                  Live Cost Projection
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  ₹{calculation.total_estimated_trip_cost_inr?.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-[#9A9E96]">
                  Approx <b>₹{calculation.per_person_cost_inr?.toLocaleString('en-IN')}</b> per person (₹{calculation.daily_per_person_inr?.toLocaleString('en-IN')}/day)
                </div>
              </div>

              {/* Itemized Expense Breakdown */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#DADCD3]">Itemized Expense Breakdown</span>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#9A9E96]">Accommodation ({Math.ceil(people/2)} room(s))</span>
                    <span className="text-white font-semibold">₹{calculation.breakdown?.accommodation?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#9A9E96]">Food & Dining ({people} pax)</span>
                    <span className="text-white font-semibold">₹{calculation.breakdown?.food?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#9A9E96]">Local Sightseeing Transport</span>
                    <span className="text-white font-semibold">₹{calculation.breakdown?.local_transport?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#9A9E96]">Intercity Transit</span>
                    <span className="text-white font-semibold">₹{calculation.breakdown?.intercity_transport?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#9A9E96]">Activities, Guides & Permits</span>
                    <span className="text-white font-semibold">₹{calculation.breakdown?.activities_permits?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#9A9E96]">Contingency Buffer (6%)</span>
                    <span className="text-[#A2B091] font-semibold">₹{calculation.breakdown?.miscellaneous_buffer?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Savings Advice */}
              <div className="p-4 rounded-2xl bg-[#090A0B]/80 border border-white/5 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#A2B091]">
                  <TrendingDown className="w-4 h-4" />
                  <span>Northeast Savings Insight</span>
                </div>
                <p className="text-[11.5px] text-[#DADCD3]/80 leading-relaxed">
                  {calculation.savings_tips?.[0]}
                </p>
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-[#9A9E96]/80 leading-normal italic">
                * {calculation.disclaimer}
              </p>

            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-6 h-6 border-2 border-[#8844C9] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
