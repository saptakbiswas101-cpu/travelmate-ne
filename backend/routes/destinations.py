from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from backend.database import db_store
from backend.models.schemas import DestinationBase

router = APIRouter(prefix="/api/destinations", tags=["Destinations"])

@router.get("", response_model=List[DestinationBase])
def get_destinations(
    search: Optional[str] = None,
    state: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: Optional[str] = None
):
    items = db_store.get_destinations()
    
    if search:
        s_lower = str(search).lower()
        items = [d for d in items if s_lower in d["name"].lower() or s_lower in d.get("short_description", "").lower() or s_lower in d.get("state", "").lower()]
        
    if state and str(state).lower() != "all":
        items = [d for d in items if str(state).lower() in d["state"].lower()]
        
    if category and str(category).lower() != "all":
        items = [d for d in items if str(category).lower() in d["category"].lower()]
        
    if sort_by == "name":
        items = sorted(items, key=lambda x: x["name"])
    elif sort_by == "state":
        items = sorted(items, key=lambda x: x["state"])
        
    return items

@router.get("/{dest_id}", response_model=DestinationBase)
def get_destination_detail(dest_id: str):
    dest = db_store.get_destination_by_id(dest_id)
    if not dest:
        raise HTTPException(status_code=404, detail=f"Destination '{dest_id}' not found.")
    return dest
