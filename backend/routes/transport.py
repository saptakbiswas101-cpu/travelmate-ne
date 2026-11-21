from fastapi import APIRouter
from typing import Dict, Any
from backend.database import db_store

router = APIRouter(prefix="/api/transport", tags=["Transportation"])

@router.get("", response_model=Dict[str, Any])
def get_transport_info():
    return db_store.get_transport()
