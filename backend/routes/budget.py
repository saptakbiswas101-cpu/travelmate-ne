from fastapi import APIRouter
from backend.models.schemas import BudgetCalculationRequest, BudgetCalculationResponse
from backend.services.budget_engine import calculate_trip_budget

router = APIRouter(prefix="/api/budget", tags=["Budget"])

@router.post("/calculate", response_model=BudgetCalculationResponse)
def calculate_budget(request: BudgetCalculationRequest):
    return calculate_trip_budget(request)
