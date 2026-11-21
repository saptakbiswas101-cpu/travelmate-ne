import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Search, 
  MapPin, 
  Calendar, 
  Shield, 
  CheckCircle2, 
  IndianRupee, 
  ArrowUpRight,
  TrendingUp,
  Sliders,
  ChevronRight,
  Map as MapIcon
} from 'lucide-react';
import { api } from '../services/api';
import { handleImageError } from '../utils/imageFallback';
import DestinationCard from '../components/DestinationCard';
import StateCard from '../components/StateCard';
import InteractiveMap from '../components/InteractiveMap';
import GamusaBanner from '../components/GamusaBanner';

export default function HomePage() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [states, setStates] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadData() {
      try {
        const [dests, sts, gems, foods, fests] = await Promise.all([
          api.getDestinations(),
          api.getStates(),
          api.getHiddenGems(),
          api.getFood(),
          api.getFestivals()
        ]);
        setDestinations(dests);
        setStates(sts);
        setHiddenGems(gems);
        setFoodItems(foods);
        setFestivals(fests);
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/destinations');
    }
  };

  const categories = ['All', 'Wildlife', 'Nature', 'Cultural', 'Historical', 'Adventure'];

  const filteredPopular = destinations.filter(d => {
    if (selectedCategory === 'All') return true;
    return d.category === selectedCategory;
  }).slice(0, 6);

  return (
    <div className="relative min-h-screen">
      
      {/* ====================================================
          1. HERO SECTION (Halo Lab Dark Travel-Tech Styling)
         ==================================================== */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-36 overflow-hidden">
        
        {/* Ambient Gradient Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-[#30213D]/40 via-[#8844C9]/20 to-[#B97B34]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#8844C9]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-[#8844C9]/30 text-xs font-semibold text-[#A2B091] shadow-halo-glow animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#8844C9] animate-ping" />
              <span>Explore 8 Sister States • UNESCO Sanctuaries • Indigenous Cultures</span>
            </div>

            {/* Editorial Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Discover the Northeast. <br />
              <span className="violet-gradient-text">Beyond the ordinary.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg md:text-xl text-[#9A9E96] max-w-2xl mx-auto leading-relaxed">
              Explore hidden river islands, living root bridges, snow-draped monasteries, and generate personalized travel itineraries with AI.
            </p>

            {/* Search Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative glass-panel rounded-2xl p-2 border border-white/10 shadow-2xl flex items-center gap-2">
                <div className="pl-3 text-[#9A9E96]">
                  <Search className="w-5 h-5 text-[#8844C9]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations (e.g. Kaziranga, Tawang, Loktak, Living Root Bridges...)"
                  className="w-full bg-transparent px-2 py-2.5 text-sm sm:text-base text-white placeholder-[#9A9E96] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8844C9] to-[#30213D] hover:from-[#9d55e0] hover:to-[#432d56] text-white font-semibold text-sm shadow-halo-glow transition duration-200 flex items-center space-x-1.5 shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Popular Pills */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-[#9A9E96]">
                <span className="text-[#DADCD3]/60">Popular:</span>
                {['Kaziranga', 'Cherrapunji', 'Tawang', 'Majuli', 'Dzukou Valley', 'Gurudongmar'].map((term) => (
                  <button
                    key={term}
                    onClick={() => navigate(`/destinations?search=${term}`)}
                    className="px-2.5 py-1 rounded-lg bg-[#151319] hover:bg-[#30213D]/60 border border-white/5 text-[#DADCD3] hover:text-white transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/destinations"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#8844C9] to-[#30213D] text-white font-bold text-sm shadow-halo-glow hover:scale-105 transition-all flex items-center space-x-2"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Destinations</span>
              </Link>
              <Link
                to="/plan-trip"
                className="px-6 py-3.5 rounded-xl bg-[#151319] hover:bg-[#30213D]/40 text-[#A2B091] hover:text-white font-bold text-sm border border-[#8844C9]/30 transition flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-[#8844C9]" />
                <span>AI Smart Trip Planner</span>
              </Link>
            </div>

          </div>

          {/* Cinematic Hero Gallery Banner */}
          <div className="mt-14 relative rounded-3xl overflow-hidden border border-white/10 glass-panel shadow-2xl aspect-[21/9] max-h-[500px] bg-[#151319]">
            <img
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop"
              alt="Himalayan Mountain Landscape of Northeast India"
              onError={(e) => handleImageError(e, 'Nature')}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0B] via-transparent to-black/30" />
            
            {/* Overlay Badges */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-[#8844C9]/40 backdrop-blur-md border border-[#8844C9]/40 text-[#A2B091]">
                  Featured Sanctuary
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Nohkalikai Falls & Sohra Canyons, Meghalaya
                </h3>
                <p className="text-xs sm:text-sm text-[#DADCD3]/80">
                  India's tallest plunge waterfall cascading 1,115 feet into an emerald pool.
                </p>
              </div>

              <Link
                to="/destinations/cherrapunji-sohra-bridges"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold transition flex items-center space-x-1.5"
              >
                <span>Discover Sohra</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================
          2. EXPLORE EIGHT STATES SECTION
         ==================================================== */}
      <section className="py-20 border-t border-white/5 bg-[#151319]/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#8844C9] uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>The Eight Sisters</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Explore All Eight States
              </h2>
              <p className="text-sm text-[#9A9E96] mt-2 max-w-xl">
                Each state possesses its own distinct geography, languages, indigenous clans, culinary traditions, and entry permit requirements.
              </p>
            </div>

            <Link
              to="/states"
              className="text-xs font-bold text-[#A2B091] hover:text-white flex items-center space-x-1 transition group"
            >
              <span>View State Guides</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {states.map((st) => (
              <StateCard key={st.id} state={st} />
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================
          3. POPULAR DESTINATIONS WITH CATEGORY FILTER
         ==================================================== */}
      <section className="py-20 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#B97B34] uppercase tracking-wider mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Must-Visit Landmarks</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Popular Destinations
              </h2>
              <p className="text-sm text-[#9A9E96] mt-2">
                Hand-curated iconic sites across wildlife sanctuaries, living root wonders, and sacred monasteries.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-[#8844C9] text-white shadow-halo-glow'
                      : 'bg-[#151319] text-[#9A9E96] hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPopular.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/destinations"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#151319] hover:bg-[#30213D] border border-white/10 text-sm font-semibold text-[#DADCD3] hover:text-white transition"
            >
              <span>Explore All {destinations.length}+ Verified Destinations</span>
              <ArrowRight className="w-4 h-4 text-[#8844C9]" />
            </Link>
          </div>

        </div>
      </section>

      {/* ====================================================
          4. HIDDEN GEMS (OFFBEAT NORTHEAST SECRETS)
         ==================================================== */}
      <section className="py-20 border-t border-white/5 bg-[#151319]/30 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#8844C9]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#A2B091] uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Untouched & Unspoiled</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Offbeat Hidden Gems
              </h2>
              <p className="text-sm text-[#9A9E96] mt-2 max-w-xl">
                Step off the tourist trail into peaceful eco-villages, secret river islands, and hidden ancient rock carvings.
              </p>
            </div>

            <Link
              to="/hidden-gems"
              className="text-xs font-bold text-[#A2B091] hover:text-white flex items-center space-x-1 transition group"
            >
              <span>Browse All {hiddenGems.length} Hidden Gems</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hiddenGems.slice(0, 6).map((gem) => (
              <div key={gem.id} className="rounded-2xl p-6 glass-panel border border-white/10 halo-card flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#8844C9]/20 text-[#A2B091] border border-[#8844C9]/30">
                      {gem.state}
                    </span>
                    <span className="text-xs text-[#9A9E96] font-medium">
                      {gem.approximate_budget}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {gem.name}
                  </h3>

                  <p className="text-xs text-[#DADCD3]/80 leading-relaxed">
                    {gem.description}
                  </p>

                  <div className="p-3 rounded-xl bg-[#090A0B]/60 border border-white/5 space-y-1">
                    <span className="text-[10.5px] uppercase font-bold text-[#B97B34] tracking-wide">
                      Why It's Worth Visiting:
                    </span>
                    <p className="text-xs text-[#9A9E96] leading-relaxed">
                      {gem.why_worth_visiting}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#A2B091]">
                  <span>Responsible Travel Tip</span>
                  <Link to="/hidden-gems" className="hover:underline flex items-center space-x-1">
                    <span>Read advice</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================
          5. SMART AI TRIP PLANNER BANNER
         ==================================================== */}
      <section className="py-20 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border border-[#8844C9]/30 bg-gradient-to-br from-[#30213D]/90 via-[#151319] to-[#090A0B] shadow-2xl">
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#8844C9]/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#8844C9]/30 border border-[#8844C9]/40 text-xs font-bold text-[#A2B091]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powered by Google Gemini & Verified Regional Data</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Generate Your Personalized <br />
                <span className="violet-gradient-text">Northeast Itinerary in Seconds</span>
              </h2>

              <p className="text-sm sm:text-base text-[#DADCD3]/80 leading-relaxed">
                Tell us your starting city, group size, duration, and budget in INR. Our AI crafts a day-by-day morning, afternoon, and evening schedule with realistic transit times, accommodation estimates, and safety precautions.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/plan-trip"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#8844C9] to-[#30213D] hover:from-[#9d55e0] hover:to-[#432d56] text-white font-bold text-sm shadow-halo-glow transition duration-200 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-[#A2B091]" />
                  <span>Launch AI Trip Planner</span>
                </Link>

                <Link
                  to="/budget-calculator"
                  className="px-6 py-3.5 rounded-xl bg-[#151319] hover:bg-white/5 border border-white/10 text-[#DADCD3] text-sm font-semibold transition flex items-center space-x-2"
                >
                  <IndianRupee className="w-4 h-4 text-[#B97B34]" />
                  <span>Trip Cost Calculator</span>
                </Link>
              </div>

              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#9A9E96]">
                <div>✓ Verified Travel Routes</div>
                <div>✓ Zero Fabricated Bookings</div>
                <div>✓ Inner Line Permit Checks</div>
                <div>✓ Printable & Offline Export</div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ====================================================
          6. CULTURE, CUISINE & FESTIVALS PREVIEW
         ==================================================== */}
      <section className="py-20 border-t border-white/5 bg-[#151319]/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#8844C9] uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4" />
                <span>Rich Indigenous Heritage</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Authentic Food & Festivals
              </h2>
              <p className="text-sm text-[#9A9E96] mt-2 max-w-xl">
                Northeast India boasts extraordinary culinary depth and calendar festivals celebrating harvests, warrior folklore, and spring revivals.
              </p>
            </div>

            <Link
              to="/culture"
              className="text-xs font-bold text-[#A2B091] hover:text-white flex items-center space-x-1 transition group"
            >
              <span>Explore Culture & 30+ Dishes</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {foodItems.slice(0, 4).map((f) => (
              <div key={f.id} className="rounded-2xl overflow-hidden halo-card glass-panel flex flex-col">
                <div className="aspect-[16/10] bg-[#151319] overflow-hidden relative">
                  <img 
                    src={f.image_url} 
                    alt={f.name} 
                    onError={(e) => handleImageError(e, 'Food')}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                  />
                  <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                    f.is_vegetarian 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {f.is_vegetarian ? 'Veg' : 'Non-Veg'}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white">
                    {f.state}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] text-[#A2B091] font-semibold uppercase">{f.community} Tradition</span>
                    <h4 className="text-base font-bold text-white">{f.name}</h4>
                    <p className="text-xs text-[#9A9E96] line-clamp-2 mt-1 leading-relaxed">{f.description}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[11px] text-[#DADCD3]/70 italic">
                    Taste: {f.taste_profile}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================
          7. INTERACTIVE MAP SECTION PREVIEW
         ==================================================== */}
      <section className="py-20 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#8844C9] uppercase tracking-wider mb-2">
                <MapIcon className="w-4 h-4" />
                <span>Geospatial Exploration</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Geographic Destination Map
              </h2>
              <p className="text-sm text-[#9A9E96] mt-2">
                Click any marker to inspect coordinates, best visiting season, and launch GPS driving directions.
              </p>
            </div>

            <Link
              to="/map"
              className="text-xs font-bold text-[#A2B091] hover:text-white flex items-center space-x-1 transition group"
            >
              <span>Full Screen Map</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <InteractiveMap destinations={destinations} height="520px" initialZoom={7} />

        </div>
      </section>

    </div>
  );
}
