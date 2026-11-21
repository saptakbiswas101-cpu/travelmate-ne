from fastapi import APIRouter, HTTPException, Header
from typing import Optional, Dict, Any, List
from backend.models.schemas import UserRegister, UserLogin, UserProfile
from backend.services.auth_service import hash_password, create_access_token, decode_access_token
from backend.database import db_store

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register")
def register_user(req: UserRegister):
    email = req.email.strip().lower()
    if email in db_store.users:
        raise HTTPException(status_code=400, detail="User with this email already exists.")
        
    db_store.users[email] = {
        "email": email,
        "full_name": req.full_name,
        "password_hash": hash_password(req.password),
        "saved_destinations": [],
        "saved_itineraries": []
    }
    token = create_access_token({"sub": email, "name": req.full_name})
    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "email": email,
            "full_name": req.full_name,
            "saved_destinations": [],
            "saved_itineraries": []
        }
    }

@router.post("/login")
def login_user(req: UserLogin):
    email = req.email.strip().lower()
    user = db_store.users.get(email)
    
    # Pre-seed demo user if logging in with demo credentials
    if not user and email == "demo@travelmatene.com" and req.password == "northeast2026":
        db_store.users[email] = {
            "email": email,
            "full_name": "Northeast Explorer",
            "password_hash": hash_password("northeast2026"),
            "saved_destinations": ["kaziranga-national-park", "cherrapunji-sohra-bridges", "tawang-monastery-pass"],
            "saved_itineraries": []
        }
        user = db_store.users[email]
        
    if not user or user["password_hash"] != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
        
    token = create_access_token({"sub": email, "name": user["full_name"]})
    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "email": user["email"],
            "full_name": user["full_name"],
            "saved_destinations": user.get("saved_destinations", []),
            "saved_itineraries": user.get("saved_itineraries", [])
        }
    }

@router.get("/me")
def get_current_user_profile(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header.")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token expired or invalid.")
        
    email = payload.get("sub")
    user = db_store.users.get(email)
    if not user:
        return {
            "email": email,
            "full_name": payload.get("name", "Traveler"),
            "saved_destinations": [],
            "saved_itineraries": []
        }
    return {
        "email": user["email"],
        "full_name": user["full_name"],
        "saved_destinations": user.get("saved_destinations", []),
        "saved_itineraries": user.get("saved_itineraries", [])
    }

@router.post("/saved-destinations")
def toggle_save_destination(data: Dict[str, str], authorization: Optional[str] = Header(None)):
    dest_id = data.get("destination_id")
    if not dest_id:
        raise HTTPException(status_code=400, detail="Missing destination_id")
        
    email = "anonymous"
    if authorization and authorization.startswith("Bearer "):
        payload = decode_access_token(authorization.split(" ")[1])
        if payload:
            email = payload.get("sub", "anonymous")
            
    if email not in db_store.saved_destinations:
        db_store.saved_destinations[email] = []
        
    saved = db_store.saved_destinations[email]
    if dest_id in saved:
        saved.remove(dest_id)
        action = "removed"
    else:
        saved.append(dest_id)
        action = "saved"
        
    if email in db_store.users:
        db_store.users[email]["saved_destinations"] = saved
        
    return {"action": action, "saved_destinations": saved}

@router.post("/saved-itineraries")
def save_itinerary(itinerary: Dict[str, Any], authorization: Optional[str] = Header(None)):
    email = "anonymous"
    if authorization and authorization.startswith("Bearer "):
        payload = decode_access_token(authorization.split(" ")[1])
        if payload:
            email = payload.get("sub", "anonymous")
            
    if email not in db_store.saved_itineraries:
        db_store.saved_itineraries[email] = []
        
    db_store.saved_itineraries[email].append(itinerary)
    if email in db_store.users:
        db_store.users[email]["saved_itineraries"] = db_store.saved_itineraries[email]
        
    return {"message": "Itinerary saved successfully", "count": len(db_store.saved_itineraries[email])}
