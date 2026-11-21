from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Coordinates(BaseModel):
    lat: float
    lng: float

class DestinationBase(BaseModel):
    id: str
    name: str
    state: str
    district: Optional[str] = None
    category: str
    short_description: str
    detailed_description: str
    latitude: float
    longitude: float
    best_season: str
    duration: str
    budget_range: str
    activities: List[str]
    accessibility: str
    traveller_types: List[str]
    image_url: str
    precautions: str

class HiddenGem(BaseModel):
    id: str
    name: str
    state: str
    description: str
    why_worth_visiting: str
    activities: List[str]
    accessibility: str
    approximate_budget: str
    responsible_tourism: str

class FoodItem(BaseModel):
    id: str
    name: str
    state: str
    community: Optional[str] = None
    description: str
    category: str
    is_vegetarian: bool
    image_url: str
    ingredients: Optional[List[str]] = None
    taste_profile: Optional[str] = None

class Festival(BaseModel):
    id: str
    name: str
    state: str
    period: str
    is_fixed_date: bool
    cultural_importance: str
    location: str
    highlights: List[str]

class StateInfo(BaseModel):
    id: str
    name: str
    capital: str
    tagline: str
    nickname: str
    description: str
    permit_required: bool
    permit_details: str
    best_season: str
    hero_image: str
    coordinates: Coordinates
    highlights: List[str]

# TRIP PLANNER
class TripPlannerRequest(BaseModel):
    starting_city: str = Field(..., description="e.g. Guwahati, Kolkata, Delhi, Shillong")
    preferred_states: List[str] = Field(default_factory=list, description="List of preferred states, e.g. ['Assam', 'Meghalaya']")
    travel_days: int = Field(..., ge=1, le=15, description="Duration in days (1-15)")
    traveller_count: int = Field(..., ge=1, le=20, description="Number of travellers")
    travel_month: str = Field(..., description="Month of travel, e.g. November")
    budget_inr: float = Field(..., ge=1000, description="Total budget in INR")
    travel_style: str = Field(..., description="Budget, Adventure, Nature, Cultural, Family, Solo")

class ItineraryDay(BaseModel):
    day_number: int
    title: str
    destination_name: str
    state: str
    morning_activity: str
    afternoon_activity: str
    evening_activity: str
    stay_recommendation: str
    estimated_day_cost_inr: float
    transit_info: str

class TripPlannerResponse(BaseModel):
    trip_title: str
    starting_city: str
    total_days: int
    travellers: int
    travel_style: str
    travel_month: str
    days: List[ItineraryDay]
    total_estimated_cost_inr: float
    cost_breakdown: Dict[str, float]
    per_person_cost_inr: float
    budget_comparison: str
    precautions: List[str]
    alternative_budget_tips: List[str]
    is_ai_generated: bool
    ai_model: Optional[str] = None

# BUDGET CALCULATOR
class BudgetCalculationRequest(BaseModel):
    travel_days: int = Field(..., ge=1, le=30)
    traveller_count: int = Field(..., ge=1, le=30)
    accommodation_tier: str = Field(..., description="budget, mid_range, luxury")
    transport_type: str = Field(..., description="public_shared, private_cab, self_drive")
    food_preference: str = Field(..., description="local_eateries, standard_restaurants, fine_dining")
    activity_level: str = Field(..., description="relaxed, moderate, active")
    selected_state: Optional[str] = "All Northeast"

class ExpenseBreakdown(BaseModel):
    accommodation: float
    food: float
    local_transport: float
    intercity_transport: float
    activities_permits: float
    miscellaneous_buffer: float

class BudgetCalculationResponse(BaseModel):
    total_estimated_trip_cost_inr: float
    per_person_cost_inr: float
    breakdown: ExpenseBreakdown
    daily_per_person_inr: float
    comparison_benchmarks: Dict[str, float]
    savings_tips: List[str]
    disclaimer: str

# AUTH
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    email: str
    full_name: str
    saved_destinations: List[str]
    saved_itineraries: List[Dict[str, Any]]
