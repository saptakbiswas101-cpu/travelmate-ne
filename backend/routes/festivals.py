from fastapi import APIRouter
from typing import List, Optional
from backend.database import db_store
from backend.models.schemas import Festival

router = APIRouter(prefix="/api/festivals", tags=["Festivals"])

@router.get("", response_model=List[Festival])
def get_all_festivals(
    state: Optional[str] = None
):
    items = db_store.get_festivals()
    if state and str(state).lower() != "all":
        items = [f for f in items if str(state).lower() in f["state"].lower()]
    return items
