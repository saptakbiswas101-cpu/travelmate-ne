from fastapi import APIRouter
from backend.models.schemas import TripPlannerRequest, TripPlannerResponse
from backend.services.ai_planner import generate_ai_itinerary

router = APIRouter(prefix="/api/trip-planner", tags=["Trip Planner"])

@router.post("", response_model=TripPlannerResponse)
def plan_trip(request: TripPlannerRequest):
    return generate_ai_itinerary(request)
