from fastapi import APIRouter
from typing import List
from backend.database import db_store
from backend.models.schemas import HiddenGem

router = APIRouter(prefix="/api/hidden-gems", tags=["Hidden Gems"])

@router.get("", response_model=List[HiddenGem])
def get_hidden_gems():
    return db_store.get_hidden_gems()
