from fastapi import APIRouter, HTTPException
from typing import List
from backend.database import db_store
from backend.models.schemas import StateInfo

router = APIRouter(prefix="/api/states", tags=["States"])

@router.get("", response_model=List[StateInfo])
def get_all_states():
    return db_store.get_states()

@router.get("/{state_id}", response_model=StateInfo)
def get_state_detail(state_id: str):
    states = db_store.get_states()
    for s in states:
        if s["id"].lower() == state_id.lower() or s["name"].lower() == state_id.lower():
            return s
    raise HTTPException(status_code=404, detail=f"State '{state_id}' not found.")
