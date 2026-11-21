from fastapi import APIRouter
from typing import List, Optional
from backend.database import db_store
from backend.models.schemas import FoodItem

router = APIRouter(prefix="/api/food", tags=["Food"])

@router.get("", response_model=List[FoodItem])
def get_all_food(
    state: Optional[str] = None,
    is_veg: Optional[bool] = None
):
    items = db_store.get_food()
    if state and str(state).lower() != "all":
        items = [f for f in items if str(state).lower() in f["state"].lower()]
    if is_veg is not None:
        items = [f for f in items if f["is_vegetarian"] == is_veg]
    return items
