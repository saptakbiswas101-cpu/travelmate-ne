import math
from backend.models.schemas import (
    BudgetCalculationRequest,
    BudgetCalculationResponse,
    ExpenseBreakdown
)

def calculate_trip_budget(req: BudgetCalculationRequest) -> BudgetCalculationResponse:
    days = req.travel_days
    people = req.traveller_count
    rooms_needed = math.ceil(people / 2)

    # 1. Accommodation
    acc_daily_rates = {
        "budget": 950.0,       # Traditional stilt homestay / backpacker lodge
        "mid_range": 3200.0,   # 3-star boutique hill resort / tea estate cottage
        "luxury": 9500.0       # Luxury heritage bungalow / 5-star mountain retreat
    }
    acc_rate = acc_daily_rates.get(req.accommodation_tier.lower(), 2500.0)
    total_acc = acc_rate * rooms_needed * max(days - 1, 1)

    # 2. Food
    food_daily_rates = {
        "local_eateries": 450.0,        # Local market stalls, Assamese thalis, Momo shacks
        "standard_restaurants": 1100.0, # Multi-cuisine dining & heritage restaurants
        "fine_dining": 2600.0           # Curated ethnic degustation & hotel dining
    }
    food_rate = food_daily_rates.get(req.food_preference.lower(), 900.0)
    total_food = food_rate * people * days

    # 3. Local & Intercity Transportation
    vehicles_needed = math.ceil(people / 4)
    if req.transport_type == "public_shared":
        total_local_trans = 450.0 * people * days
        total_intercity = 900.0 * people
    elif req.transport_type == "private_cab":
        # Dedicated SUV / Hatchback with driver in hills
        total_local_trans = 3800.0 * vehicles_needed * days
        total_intercity = 2500.0 * vehicles_needed
    else:  # self_drive / rental bike or car
        total_local_trans = (2400.0 + 1200.0) * vehicles_needed * days
        total_intercity = 1800.0 * vehicles_needed

    # 4. Activities & Permits
    activity_daily_rates = {
        "relaxed": 350.0,   # Free nature trails, public viewpoints
        "moderate": 750.0,  # Museum passes, basic boat rides, village guides
        "active": 1600.0    # Kaziranga Jeep/Elephant safaris, rafting, living bridge guide, ILP permits
    }
    act_rate = activity_daily_rates.get(req.activity_level.lower(), 650.0)
    total_act = act_rate * people * days

    # 5. Buffer
    subtotal = total_acc + total_food + total_local_trans + total_intercity + total_act
    misc_buffer = round(subtotal * 0.06, 2)
    total_cost = round(subtotal + misc_buffer, 2)
    per_person = round(total_cost / people, 2)
    daily_per_person = round(per_person / days, 2)

    breakdown = ExpenseBreakdown(
        accommodation=round(total_acc, 2),
        food=round(total_food, 2),
        local_transport=round(total_local_trans, 2),
        intercity_transport=round(total_intercity, 2),
        activities_permits=round(total_act, 2),
        miscellaneous_buffer=misc_buffer
    )

    comparison = {
        "backpacker_budget_avg": round(1800.0 * people * days, 2),
        "mid_range_comfort_avg": round(3800.0 * people * days, 2),
        "luxury_boutique_avg": round(8500.0 * people * days, 2)
    }

    savings_tips = [
        "Group travel significantly lowers per-person private vehicle costs since SUV cab rates (₹3,800/day) are shared by up to 4 travellers.",
        "Choosing community homestays in places like Majuli, Khonoma, or Mawlynnong saves up to 50% on lodging while providing home-cooked organic meals.",
        "Book Kaziranga and Manas national park morning safaris directly through forest department booking counters to skip middleman markups.",
        "Try authentic thalis (Khar, Bai, Thukpa) in town markets for wholesome meals at a fraction of tourist restaurant prices."
    ]

    return BudgetCalculationResponse(
        total_estimated_trip_cost_inr=total_cost,
        per_person_cost_inr=per_person,
        breakdown=breakdown,
        daily_per_person_inr=daily_per_person,
        comparison_benchmarks=comparison,
        savings_tips=savings_tips,
        disclaimer="Estimates are illustrative based on seasonal Northeast India travel benchmarks (2025-2026). Actual prices vary with fuel costs and tourist seasonality."
    )
