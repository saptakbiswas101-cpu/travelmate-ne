import localDestinations from '../data/destinations.json';
import localStates from '../data/states.json';
import localHiddenGems from '../data/hidden_gems.json';
import localFood from '../data/food.json';
import localFestivals from '../data/festivals.json';
import localTransport from '../data/transportation.json';
import localBudgetBenchmarks from '../data/budget_benchmarks.json';

// Production API URL configured via VITE_API_BASE_URL (defaults to /api for local dev proxy)
const RAW_BASE = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE = RAW_BASE ? (RAW_BASE.endsWith('/api') ? RAW_BASE : `${RAW_BASE.replace(/\/$/, '')}/api`) : '/api';

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    return null;
  }
}

export const api = {
  // Destinations
  async getDestinations(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.state && params.state !== 'all') query.append('state', params.state);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.sort_by) query.append('sort_by', params.sort_by);

    const data = await safeFetch(`${API_BASE}/destinations?${query.toString()}`);
    if (data && Array.isArray(data)) return data;

    // Fallback: local filter
    let items = [...localDestinations];
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.state.toLowerCase().includes(q) || 
        d.short_description.toLowerCase().includes(q)
      );
    }
    if (params.state && params.state !== 'all') {
      items = items.filter(d => d.state.toLowerCase() === params.state.toLowerCase());
    }
    if (params.category && params.category !== 'all') {
      items = items.filter(d => d.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.sort_by === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (params.sort_by === 'state') {
      items.sort((a, b) => a.state.localeCompare(b.state));
    }
    return items;
  },

  async getDestinationById(id) {
    const data = await safeFetch(`${API_BASE}/destinations/${id}`);
    if (data) return data;
    return localDestinations.find(d => d.id === id) || null;
  },

  getDestinationByIdSync(id) {
    return localDestinations.find(d => d.id === id) || null;
  },

  // States
  async getStates() {
    const data = await safeFetch(`${API_BASE}/states`);
    if (data && Array.isArray(data)) return data;
    return localStates;
  },

  async getStateById(id) {
    const data = await safeFetch(`${API_BASE}/states/${id}`);
    if (data) return data;
    return localStates.find(s => s.id.toLowerCase() === id.toLowerCase() || s.name.toLowerCase() === id.toLowerCase()) || null;
  },

  // Hidden Gems
  async getHiddenGems() {
    const data = await safeFetch(`${API_BASE}/hidden-gems`);
    if (data && Array.isArray(data)) return data;
    return localHiddenGems;
  },

  // Food
  async getFood(params = {}) {
    const query = new URLSearchParams();
    if (params.state && params.state !== 'all') query.append('state', params.state);
    if (params.is_veg !== undefined && params.is_veg !== null) query.append('is_veg', params.is_veg);

    const data = await safeFetch(`${API_BASE}/food?${query.toString()}`);
    if (data && Array.isArray(data)) return data;

    let items = [...localFood];
    if (params.state && params.state !== 'all') {
      items = items.filter(f => f.state.toLowerCase() === params.state.toLowerCase());
    }
    if (params.is_veg !== undefined && params.is_veg !== null) {
      items = items.filter(f => f.is_vegetarian === params.is_veg);
    }
    return items;
  },

  // Festivals
  async getFestivals(params = {}) {
    const query = new URLSearchParams();
    if (params.state && params.state !== 'all') query.append('state', params.state);

    const data = await safeFetch(`${API_BASE}/festivals?${query.toString()}`);
    if (data && Array.isArray(data)) return data;

    let items = [...localFestivals];
    if (params.state && params.state !== 'all') {
      items = items.filter(f => f.state.toLowerCase() === params.state.toLowerCase());
    }
    return items;
  },

  // Transportation
  async getTransport() {
    const data = await safeFetch(`${API_BASE}/transport`);
    if (data) return data;
    return localTransport;
  },

  // Budget Benchmarks
  async getBudgetBenchmarks() {
    return localBudgetBenchmarks;
  },

  // AI Trip Planner
  async planTrip(plannerRequest) {
    const data = await safeFetch(`${API_BASE}/trip-planner`, {
      method: 'POST',
      body: JSON.stringify(plannerRequest)
    });
    if (data) return data;

    // Client-side fallback generator
    return this.generateClientFallbackItinerary(plannerRequest);
  },

  generateClientFallbackItinerary(req) {
    let pool = [...localDestinations];
    if (req.preferred_states && req.preferred_states.length > 0) {
      pool = pool.filter(d => req.preferred_states.some(s => s.toLowerCase() === d.state.toLowerCase()));
      if (pool.length === 0) pool = [...localDestinations];
    }

    const numDays = Math.min(req.travel_days || 5, 15);
    const travellers = req.traveller_count || 2;
    const dailyBase = req.travel_style === 'Budget' ? 1800 : req.travel_style === 'Luxury' ? 6500 : 3200;

    const days = [];
    for (let i = 0; i < numDays; i++) {
      const dest = pool[i % pool.length];
      const acts = dest.activities || ["Scenic walks", "Local cultural experience", "Mountain viewpoints"];
      days.push({
        day_number: i + 1,
        title: `Day ${i + 1}: ${dest.name}, ${dest.state}`,
        destination_name: dest.name,
        state: dest.state,
        morning_activity: `Morning arrival: ${acts[0] || 'Guided exploration'} in ${dest.name}.`,
        afternoon_activity: `Afternoon immersion: ${acts[1] || 'Local cultural visits and village exploration'}.`,
        evening_activity: `Evening leisure: ${acts[2] || 'Sunset viewpoint and authentic ethnic dining'}.`,
        stay_recommendation: `Boutique eco-homestay or mountain cottage in ${dest.name}`,
        estimated_day_cost_inr: dailyBase * travellers,
        transit_info: i === 0 
          ? `Depart from ${req.starting_city} to ${dest.name} via scenic mountain highway.`
          : `Local transit across ${dest.district || dest.state}.`
      });
    }

    const totalEst = days.reduce((acc, d) => acc + d.estimated_day_cost_inr, 0);
    const diff = (req.budget_inr || 25000) - totalEst;

    return {
      trip_title: `${numDays}-Day ${req.travel_style} Journey across ${req.preferred_states?.join(', ') || 'Northeast India'}`,
      starting_city: req.starting_city,
      total_days: numDays,
      travellers: travellers,
      travel_style: req.travel_style,
      travel_month: req.travel_month,
      days: days,
      total_estimated_cost_inr: totalEst,
      cost_breakdown: {
        accommodation: Math.round(totalEst * 0.38),
        transportation: Math.round(totalEst * 0.28),
        food_dining: Math.round(totalEst * 0.20),
        activities_permits: Math.round(totalEst * 0.10),
        miscellaneous_emergency: Math.round(totalEst * 0.04)
      },
      per_person_cost_inr: Math.round(totalEst / travellers),
      budget_comparison: diff >= 0 
        ? `Within budget! You have a comfortable buffer of ₹${Math.abs(diff).toLocaleString('en-IN')}.`
        : `Slightly above estimated budget by ₹${Math.abs(diff).toLocaleString('en-IN')}. Consider opting for shared transport.`,
      precautions: [
        "Inner Line Permits (ILP) required for Arunachal Pradesh, Nagaland, Mizoram, and Manipur.",
        "Mountain road twists are common; allow travel buffers between destinations.",
        "Carry sufficient cash as rural bank ATMs can occasionally be out of service."
      ],
      alternative_budget_tips: [
        "Take shared Tata Sumos or ASTC/NST buses to reduce inter-city transportation costs.",
        "Stay at local stilt homestays (e.g. Majuli Mishing homestays, Khonoma Angami cottages) for authentic food and low costs."
      ],
      is_ai_generated: false,
      ai_model: "TravelMateNE Curated Expert Engine"
    };
  },

  // Budget Calculator
  async calculateBudget(req) {
    const data = await safeFetch(`${API_BASE}/budget/calculate`, {
      method: 'POST',
      body: JSON.stringify(req)
    });
    if (data) return data;

    // Client-side fallback calculation
    const days = req.travel_days;
    const people = req.traveller_count;
    const rooms = Math.ceil(people / 2);
    const vehicles = Math.ceil(people / 4);

    const accDaily = req.accommodation_tier === 'budget' ? 950 : req.accommodation_tier === 'luxury' ? 9500 : 3200;
    const foodDaily = req.food_preference === 'local_eateries' ? 450 : req.food_preference === 'fine_dining' ? 2600 : 1100;
    const localTransDaily = req.transport_type === 'public_shared' ? 450 * people : req.transport_type === 'private_cab' ? 3800 * vehicles : 3600 * vehicles;
    const intercity = req.transport_type === 'public_shared' ? 900 * people : 2500 * vehicles;
    const actDaily = req.activity_level === 'relaxed' ? 350 * people : req.activity_level === 'active' ? 1600 * people : 750 * people;

    const accTotal = accDaily * rooms * Math.max(days - 1, 1);
    const foodTotal = foodDaily * people * days;
    const localTransTotal = localTransDaily * days;
    const actTotal = actDaily * days;

    const sub = accTotal + foodTotal + localTransTotal + intercity + actTotal;
    const misc = Math.round(sub * 0.06);
    const total = sub + misc;
    const perPerson = Math.round(total / people);

    return {
      total_estimated_trip_cost_inr: total,
      per_person_cost_inr: perPerson,
      breakdown: {
        accommodation: accTotal,
        food: foodTotal,
        local_transport: localTransTotal,
        intercity_transport: intercity,
        activities_permits: actTotal,
        miscellaneous_buffer: misc
      },
      daily_per_person_inr: Math.round(perPerson / days),
      comparison_benchmarks: {
        backpacker_budget_avg: 1800 * people * days,
        mid_range_comfort_avg: 3800 * people * days,
        luxury_boutique_avg: 8500 * people * days
      },
      savings_tips: [
        "Booking shared SUV cabs between Guwahati, Shillong, and Kaziranga significantly reduces transit expenses.",
        "Eat wholesome Assamese, Khasi, and Naga Thalis at trusted local dhabas.",
        "Homestays in villages like Mawlynnong, Khonoma, and Majuli provide incredible warmth and savings."
      ],
      disclaimer: "Estimates are illustrative based on seasonal Northeast India travel benchmarks (2025-2026)."
    };
  },

  // Auth & Saved Items
  async register(userData) {
    const data = await safeFetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return data;
  },

  async login(credentials) {
    const data = await safeFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return data;
  },

  async getMe(token) {
    return await safeFetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async toggleSaveDestination(destId, token) {
    return await safeFetch(`${API_BASE}/auth/saved-destinations`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ destination_id: destId })
    });
  },

  async saveItinerary(itinerary, token) {
    return await safeFetch(`${API_BASE}/auth/saved-itineraries`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(itinerary)
    });
  }
};
