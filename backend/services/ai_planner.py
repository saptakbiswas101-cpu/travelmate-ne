import json
import logging
import requests
from typing import List, Dict, Any
from backend.models.schemas import TripPlannerRequest, TripPlannerResponse, ItineraryDay
from backend.database import db_store
from backend import config

logger = logging.getLogger("travelmatene.ai_planner")

def generate_rule_based_itinerary(req: TripPlannerRequest) -> TripPlannerResponse:
    """Intelligent fallback itinerary generator cross-referencing verified Northeast tourism data."""
    all_dests = db_store.get_destinations()
    
    # Filter by preferred states if specified, otherwise consider all
    if req.preferred_states:
        filtered = [d for d in all_dests if any(s.lower() in d["state"].lower() for s in req.preferred_states)]
    else:
        filtered = all_dests
    
    if not filtered:
        filtered = all_dests

    # Filter/rank by travel style
    style_keyword_map = {
        "Wildlife": ["Wildlife", "Nature"],
        "Adventure": ["Adventure", "Nature", "Offbeat"],
        "Nature": ["Nature", "Offbeat", "Wildlife"],
        "Cultural": ["Cultural", "Historical", "Spiritual"],
        "Family": ["Nature", "Cultural", "Wildlife", "Historical"],
        "Solo": ["Offbeat", "Adventure", "Nature", "Cultural"],
        "Budget": ["Nature", "Cultural", "Offbeat"]
    }
    target_cats = style_keyword_map.get(req.travel_style, ["Nature", "Cultural"])
    
    priority_dests = [d for d in filtered if d.get("category") in target_cats]
    other_dests = [d for d in filtered if d.get("category") not in target_cats]
    chosen_pool = priority_dests + other_dests

    # Build Day by Day
    days: List[ItineraryDay] = []
    num_days = min(req.travel_days, 15)

    # Cost Multiplier based on style
    tier_costs = {
        "Budget": 1800.0,
        "Solo": 2200.0,
        "Nature": 2800.0,
        "Adventure": 3200.0,
        "Cultural": 3000.0,
        "Family": 3500.0
    }
    daily_base = tier_costs.get(req.travel_style, 2500.0)

    for i in range(num_days):
        day_num = i + 1
        dest = chosen_pool[i % len(chosen_pool)]
        acts = dest.get("activities", ["Scenic sightseeing", "Local culture walk", "Culinary exploration"])
        
        m_act = f"Morning arrival and exploration: {acts[0] if len(acts) > 0 else 'Sightseeing'} at {dest['name']}."
        a_act = f"Afternoon guided experience: {acts[1] if len(acts) > 1 else 'Local market and village visit'}."
        e_act = f"Evening unwind: {acts[2] if len(acts) > 2 else 'Sunset viewpoint walk and regional dinner'}."
        
        if day_num == 1:
            transit = f"Depart from {req.starting_city} towards {dest['name']}. {dest.get('accessibility', 'Scenic mountain drive')}."
        elif day_num == num_days:
            transit = f"Morning checkout from {dest['name']} and return journey transit back to {req.starting_city} or nearest airport."
        else:
            transit = f"Local transport across {dest.get('district', dest['state'])} via shared cab or private vehicle."

        stay = f"Eco-friendly homestay or boutique lodge in {dest['name']} ({dest['state']})"
        day_cost = daily_base * req.traveller_count

        days.append(ItineraryDay(
            day_number=day_num,
            title=f"Day {day_num}: {dest['name']}, {dest['state']}",
            destination_name=dest['name'],
            state=dest['state'],
            morning_activity=m_act,
            afternoon_activity=a_act,
            evening_activity=e_act,
            stay_recommendation=stay,
            estimated_day_cost_inr=day_cost,
            transit_info=transit
        ))

    total_est = sum(d.estimated_day_cost_inr for d in days)
    per_person = total_est / req.traveller_count if req.traveller_count > 0 else total_est

    breakdown = {
        "accommodation": round(total_est * 0.38, 2),
        "transportation": round(total_est * 0.28, 2),
        "food_dining": round(total_est * 0.20, 2),
        "activities_permits": round(total_est * 0.10, 2),
        "miscellaneous_emergency": round(total_est * 0.04, 2)
    }

    diff = req.budget_inr - total_est
    if diff >= 0:
        budget_comp = f"Well within budget! You have an estimated buffer of ₹{abs(diff):,.0f} for special activities and souvenirs."
    else:
        budget_comp = f"Estimated cost exceeds budget by ₹{abs(diff):,.0f}. Consider opting for shared Sumo transit and village homestays."

    precautions = [
        "Carry physical passport photos and valid Indian Government photo IDs for Inner Line Permit (ILP) checkpoints if visiting Arunachal, Nagaland, Mizoram, or Manipur.",
        "Mountain roads in the Northeast can encounter occasional fog, twists, and rainfall; keep 1-2 hours travel buffer between connections.",
        "Cash is king in remote hilly regions: carry sufficient paper currency as ATM network coverage can be intermittent.",
        "Respect tribal council customary traditions, village sacred groves, and always ask permission before taking portraits."
    ]

    alt_tips = [
        "Opt for state transport buses (ASTC, NST) or shared Tata Sumos between district headquarters to slash transit expenses by 60%.",
        "Stay at community stilt homestays (e.g. Mishing Chang Ghar in Majuli or Angami homestays in Khonoma) for authentic meals and budget savings.",
        "Eat authentic ethnic Thalis (Khar, Bai, Jadoh) at local dhabas—they are nutritious, filling, and cost under ₹200."
    ]

    state_str = ", ".join(req.preferred_states) if req.preferred_states else "Northeast India"
    title = f"{num_days}-Day {req.travel_style} Expedition across {state_str}"

    return TripPlannerResponse(
        trip_title=title,
        starting_city=req.starting_city,
        total_days=num_days,
        travellers=req.traveller_count,
        travel_style=req.travel_style,
        travel_month=req.travel_month,
        days=days,
        total_estimated_cost_inr=total_est,
        cost_breakdown=breakdown,
        per_person_cost_inr=round(per_person, 2),
        budget_comparison=budget_comp,
        precautions=precautions,
        alternative_budget_tips=alt_tips,
        is_ai_generated=False,
        ai_model="TravelMateNE Curated Expert Engine"
    )

def generate_ai_itinerary(req: TripPlannerRequest) -> TripPlannerResponse:
    """Generates itinerary using Google Gemini API if configured, with automatic seamless fallback."""
    if not config.GEMINI_API_KEY:
        logger.info("GEMINI_API_KEY not configured. Using rule-based expert engine.")
        return generate_rule_based_itinerary(req)

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={config.GEMINI_API_KEY}"
        
        prompt = f"""
You are TravelMateNE's AI Travel Assistant specialized in Northeast India (Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Sikkim).
Generate a realistic, detailed day-by-day travel itinerary with the following parameters:
- Starting City: {req.starting_city}
- Preferred States: {', '.join(req.preferred_states) if req.preferred_states else 'Best suited for season'}
- Duration: {req.travel_days} days
- Travellers: {req.traveller_count}
- Month: {req.travel_month}
- Budget: ₹{req.budget_inr:,.0f} INR
- Travel Style: {req.travel_style}

Return ONLY a valid JSON object matching this exact structure:
{{
  "trip_title": "string",
  "days": [
    {{
      "day_number": 1,
      "title": "string",
      "destination_name": "string",
      "state": "string",
      "morning_activity": "string",
      "afternoon_activity": "string",
      "evening_activity": "string",
      "stay_recommendation": "string",
      "estimated_day_cost_inr": 2500,
      "transit_info": "string"
    }}
  ],
  "total_estimated_cost_inr": 15000,
  "cost_breakdown": {{
    "accommodation": 6000,
    "transportation": 4500,
    "food_dining": 3000,
    "activities_permits": 1000,
    "miscellaneous_emergency": 500
  }},
  "per_person_cost_inr": 7500,
  "budget_comparison": "string",
  "precautions": ["precaution 1", "precaution 2"],
  "alternative_budget_tips": ["tip 1", "tip 2"]
}}
"""
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.4, "maxOutputTokens": 2048}
        }
        res = requests.post(url, json=payload, timeout=12)
        if res.status_code == 200:
            data = res.json()
            raw_text = data['candidates'][0]['content']['parts'][0]['text']
            # strip markdown code fences if any
            clean_text = raw_text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            parsed = json.loads(clean_text.strip())

            # Validate days
            days = [ItineraryDay(**d) for d in parsed.get("days", [])]
            return TripPlannerResponse(
                trip_title=parsed.get("trip_title", f"{req.travel_days}-Day Northeast Journey"),
                starting_city=req.starting_city,
                total_days=req.travel_days,
                travellers=req.traveller_count,
                travel_style=req.travel_style,
                travel_month=req.travel_month,
                days=days,
                total_estimated_cost_inr=float(parsed.get("total_estimated_cost_inr", req.budget_inr)),
                cost_breakdown=parsed.get("cost_breakdown", {}),
                per_person_cost_inr=float(parsed.get("per_person_cost_inr", req.budget_inr / req.traveller_count)),
                budget_comparison=parsed.get("budget_comparison", "Calculated within budget parameters."),
                precautions=parsed.get("precautions", []),
                alternative_budget_tips=parsed.get("alternative_budget_tips", []),
                is_ai_generated=True,
                ai_model="Google Gemini 1.5 Flash"
            )
    except Exception as e:
        logger.warning(f"Gemini API invocation encountered error: {e}. Falling back gracefully.")
    
    return generate_rule_based_itinerary(req)
