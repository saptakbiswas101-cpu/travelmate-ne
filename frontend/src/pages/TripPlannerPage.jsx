import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  Compass, 
  Clock, 
  CheckCircle2, 
  Printer, 
  Bookmark, 
  AlertTriangle, 
  ArrowRight,
  TrendingDown,
  Navigation
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function TripPlannerPage() {
  const [searchParams] = useSearchParams();
  const { user, saveItinerary } = useAuth();

  // Form Inputs
  const [startingCity, setStartingCity] = useState(searchParams.get('city') || 'Guwahati');
  const [selectedStates, setSelectedStates] = useState(() => {
    const st = searchParams.get('state');
    return st ? [st] : ['Assam', 'Meghalaya'];
  });
  const [travelDays, setTravelDays] = useState(5);
  const [travellerCount, setTravellerCount] = useState(2);
  const [travelMonth, setTravelMonth] = useState('November');
  const [budgetInr, setBudgetInr] = useState(35000);
  const [travelStyle, setTravelStyle] = useState('Nature');

  // Result state
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const allStates = ['Assam', 'Arunachal Pradesh', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const styles = ['Nature', 'Wildlife', 'Adventure', 'Cultural', 'Family', 'Solo', 'Budget'];

  const toggleState = (s) => {
    if (selectedStates.includes(s)) {
      if (selectedStates.length > 1) {
        setSelectedStates(selectedStates.filter(x => x !== s));
      }
    } else {
      setSelectedStates([...selectedStates, s]);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      const plan = await api.planTrip({
        starting_city: startingCity,
        preferred_states: selectedStates,
        travel_days: parseInt(travelDays),
        traveller_count: parseInt(travellerCount),
        travel_month: travelMonth,
        budget_inr: parseFloat(budgetInr),
        travel_style: travelStyle
      });
      setItinerary(plan);
      
      // Fire subtle celebratory confetti
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (_) {}

    } catch (err) {
      console.error("Trip planning error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!itinerary) return;
    saveItinerary(itinerary);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#8844C9]/20 border border-[#8844C9]/40 text-xs font-bold text-[#A2B091]">
          <Sparkles className="w-3.5 h-3.5 text-[#8844C9]" />
          <span>Intelligent Travel Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          AI Smart Trip Planner
        </h1>
        <p className="text-sm sm:text-base text-[#9A9E96] leading-relaxed">
          Craft an optimized day-by-day travel itinerary with realistic mountain transit, accurate stay recommendations, and cost estimates grounded in verified Northeast geography.
        </p>
      </div>

      {/* Main Interactive Form Card */}
      <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-white/10 shadow-2xl relative overflow-hidden">
        
        <form onSubmit={handleGenerate} className="space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Starting City */}
            <div>
              <label className="block text-xs font-bold text-[#DADCD3] mb-2 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8844C9]" />
                <span>Starting City / Gateway</span>
              </label>
              <select
                value={startingCity}
                onChange={(e) => setStartingCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0B] border border-white/10 text-white text-sm focus:outline-none focus:border-[#8844C9]"
              >
                <option value="Guwahati">Guwahati, Assam (Primary Hub)</option>
                <option value="Dibrugarh">Dibrugarh, Assam</option>
                <option value="Shillong">Shillong, Meghalaya</option>
                <option value="Silchar">Silchar, Assam</option>
                <option value="Kolkata">Kolkata (Flight/Train Hub)</option>
                <option value="Bagdogra">Bagdogra / NJP (Sikkim Hub)</option>
                <option value="Agartala">Agartala, Tripura</option>
                <option value="Imphal">Imphal, Manipur</option>
                <option value="Dimapur">Dimapur, Nagaland</option>
              </select>
            </div>

            {/* 2. Duration Days */}
            <div>
              <label className="block text-xs font-bold text-[#DADCD3] mb-2 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8844C9]" />
                <span>Duration (1 to 15 Days)</span>
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={travelDays}
                onChange={(e) => setTravelDays(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0B] border border-white/10 text-white text-sm focus:outline-none focus:border-[#8844C9]"
              />
            </div>

            {/* 3. Number of Travellers */}
            <div>
              <label className="block text-xs font-bold text-[#DADCD3] mb-2 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-[#8844C9]" />
                <span>Travellers Count</span>
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={travellerCount}
                onChange={(e) => setTravellerCount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0B] border border-white/10 text-white text-sm focus:outline-none focus:border-[#8844C9]"
              />
            </div>

            {/* 4. Travel Month */}
            <div>
              <label className="block text-xs font-bold text-[#DADCD3] mb-2 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8844C9]" />
                <span>Travel Month</span>
              </label>
              <select
                value={travelMonth}
                onChange={(e) => setTravelMonth(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0B] border border-white/10 text-white text-sm focus:outline-none focus:border-[#8844C9]"
              >
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

          </div>

          {/* 5. Preferred States Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#DADCD3] flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-[#B97B34]" />
              <span>Select Preferred States (Multi-select)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {allStates.map(s => {
                const active = selectedStates.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleState(s)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                      active 
                        ? 'bg-[#8844C9] text-white shadow-halo-glow' 
                        : 'bg-[#090A0B] text-[#9A9E96] hover:text-white border border-white/10'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}{s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Travel Style & Budget Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
            
            {/* Travel Style */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#DADCD3]">Travel Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {styles.map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setTravelStyle(st)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
                      travelStyle === st
                        ? 'bg-[#A2B091] text-black font-bold'
                        : 'bg-[#090A0B] text-[#DADCD3] border border-white/10 hover:bg-white/5'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Budget in INR */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#DADCD3]">Total Trip Budget (INR)</span>
                <span className="text-[#A2B091] text-base">₹{parseFloat(budgetInr).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="250000"
                step="2500"
                value={budgetInr}
                onChange={(e) => setBudgetInr(e.target.value)}
                className="w-full accent-[#8844C9] bg-[#090A0B] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#9A9E96]">
                <span>₹5,000 (Backpacker)</span>
                <span>₹1,00,000</span>
                <span>₹2,50,000 (Luxury)</span>
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-[#8844C9] via-[#9d55e0] to-[#30213D] hover:scale-105 text-white font-bold text-sm shadow-halo-glow transition-all duration-300 flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Regional Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#A2B091]" />
                  <span>Generate Personalized Itinerary</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

      {/* ====================================================
          GENERATED ITINERARY DISPLAY SECTION
         ==================================================== */}
      {itinerary && (
        <div id="itinerary-result" className="space-y-8 animate-fadeIn">
          
          {/* Overview Summary Header */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#8844C9]/40 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-[#A2B091] tracking-wider">
                  Generated Plan • {itinerary.ai_model || 'TravelMateNE Engine'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                  {itinerary.trip_title}
                </h2>
                <p className="text-xs text-[#9A9E96]">
                  Starting: <b>{itinerary.starting_city}</b> • {itinerary.total_days} Days • {itinerary.travellers} Travellers • {itinerary.travel_month} • Style: {itinerary.travel_style}
                </p>
              </div>

              {/* Action Buttons: Save & Print */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition ${
                    savedSuccess 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-[#151319] hover:bg-[#30213D] text-white border-white/10'
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-[#A2B091]" />
                  <span>{savedSuccess ? 'Saved to Profile!' : 'Save Itinerary'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl bg-[#151319] hover:bg-white/5 border border-white/10 text-xs text-[#DADCD3] font-semibold flex items-center space-x-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / PDF</span>
                </button>
              </div>
            </div>

            {/* Financial Breakdown Pill Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-white/5">
              <div className="p-3 rounded-xl bg-[#090A0B]/60 border border-white/5">
                <div className="text-[10px] text-[#9A9E96] uppercase font-bold">Total Estimated</div>
                <div className="text-sm font-extrabold text-[#A2B091]">
                  ₹{itinerary.total_estimated_cost_inr?.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090A0B]/60 border border-white/5">
                <div className="text-[10px] text-[#9A9E96] uppercase font-bold">Per Person</div>
                <div className="text-sm font-extrabold text-white">
                  ₹{itinerary.per_person_cost_inr?.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090A0B]/60 border border-white/5">
                <div className="text-[10px] text-[#9A9E96] uppercase font-bold">Lodging</div>
                <div className="text-sm font-bold text-[#DADCD3]">
                  ₹{itinerary.cost_breakdown?.accommodation?.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090A0B]/60 border border-white/5">
                <div className="text-[10px] text-[#9A9E96] uppercase font-bold">Transport</div>
                <div className="text-sm font-bold text-[#DADCD3]">
                  ₹{itinerary.cost_breakdown?.transportation?.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090A0B]/60 border border-white/5">
                <div className="text-[10px] text-[#9A9E96] uppercase font-bold">Food & Dining</div>
                <div className="text-sm font-bold text-[#DADCD3]">
                  ₹{itinerary.cost_breakdown?.food_dining?.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090A0B]/60 border border-white/5">
                <div className="text-[10px] text-[#9A9E96] uppercase font-bold">Activities & Misc</div>
                <div className="text-sm font-bold text-[#DADCD3]">
                  ₹{((itinerary.cost_breakdown?.activities_permits || 0) + (itinerary.cost_breakdown?.miscellaneous_emergency || 0))?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Budget status note */}
            <div className="p-3 rounded-xl bg-[#30213D]/40 border border-[#8844C9]/30 text-xs text-[#DADCD3]">
              <b>Budget Status:</b> {itinerary.budget_comparison}
            </div>

          </div>

          {/* Day by Day Schedule Timeline */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-[#8844C9]" />
              <span>Day-by-Day Experience Schedule</span>
            </h3>

            <div className="space-y-4">
              {itinerary.days?.map((day) => (
                <div 
                  key={day.day_number}
                  className="rounded-2xl p-6 glass-panel border border-white/10 hover:border-[#8844C9]/40 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#8844C9] text-white font-extrabold flex items-center justify-center text-sm shadow-halo-glow">
                        {day.day_number}
                      </div>
                      <h4 className="text-lg font-bold text-white">
                        {day.title}
                      </h4>
                    </div>
                    <span className="text-xs font-semibold text-[#A2B091] bg-black/40 px-3 py-1 rounded-full border border-white/5">
                      Est. Day Cost: ₹{day.estimated_day_cost_inr?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Morning, Afternoon, Evening Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    
                    <div className="p-3.5 rounded-xl bg-[#090A0B]/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#A2B091] tracking-wider">
                        🌅 Morning (08:00 - 12:00)
                      </span>
                      <p className="text-xs text-[#DADCD3] leading-relaxed">
                        {day.morning_activity}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#090A0B]/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#B97B34] tracking-wider">
                        ☀️ Afternoon (12:00 - 16:30)
                      </span>
                      <p className="text-xs text-[#DADCD3] leading-relaxed">
                        {day.afternoon_activity}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#090A0B]/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#8844C9] tracking-wider">
                        🌙 Evening (17:00 - 21:00)
                      </span>
                      <p className="text-xs text-[#DADCD3] leading-relaxed">
                        {day.evening_activity}
                      </p>
                    </div>

                  </div>

                  {/* Stay & Transit Info */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#9A9E96] gap-2">
                    <div className="flex items-center space-x-1.5">
                      <Navigation className="w-3.5 h-3.5 text-[#8844C9]" />
                      <span><b>Transit:</b> {day.transit_info}</span>
                    </div>

                    <div>
                      <span><b>Stay:</b> {day.stay_recommendation}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Precautions and Budget Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
              <h4 className="text-sm font-bold text-amber-300 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Regional Travel Precautions</span>
              </h4>
              <ul className="space-y-2 text-xs text-amber-200/90">
                {itinerary.precautions?.map((p, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span>•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-[#A2B091] flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-[#A2B091]" />
                <span>Alternative Budget-Friendly Tips</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#DADCD3]/90">
                {itinerary.alternative_budget_tips?.map((tip, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
