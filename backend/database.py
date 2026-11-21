import json
import os
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("travelmatene.database")

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

class DatabaseStore:
    def __init__(self):
        self.is_mongo_connected = False
        self.mongo_client = None
        self.db = None
        self.local_cache: Dict[str, List[Dict[str, Any]]] = {}
        self.saved_destinations: Dict[str, List[str]] = {}
        self.saved_itineraries: Dict[str, List[Dict[str, Any]]] = {}
        self.users: Dict[str, Dict[str, Any]] = {}

        self.load_local_data()

    def load_local_data(self):
        """Loads JSON datasets into memory for fast querying and offline fallback."""
        filenames = {
            "destinations": "destinations.json",
            "states": "states.json",
            "hidden_gems": "hidden_gems.json",
            "food": "food.json",
            "festivals": "festivals.json",
            "transportation": "transportation.json",
            "budget_benchmarks": "budget_benchmarks.json"
        }
        for key, fname in filenames.items():
            path = os.path.join(DATA_DIR, fname)
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    self.local_cache[key] = json.load(f)
            else:
                self.local_cache[key] = []
        logger.info("Local JSON datasets loaded successfully.")

    def connect_mongo(self, uri: str, db_name: str):
        if not uri:
            logger.info("No MONGODB_URI configured. Running with high-performance local JSON engine.")
            return False
        try:
            from pymongo import MongoClient
            self.mongo_client = MongoClient(uri, serverSelectionTimeoutMS=4000)
            self.mongo_client.admin.command('ping')
            self.db = self.mongo_client[db_name]
            self.is_mongo_connected = True
            logger.info(f"Connected to MongoDB Atlas: {db_name}")
            return True
        except Exception as e:
            logger.warning(f"MongoDB connection failed: {e}. Falling back to local JSON store.")
            self.is_mongo_connected = False
            return False

    def get_destinations(self) -> List[Dict[str, Any]]:
        if self.is_mongo_connected and self.db is not None:
            try:
                docs = list(self.db.destinations.find({}, {"_id": 0}))
                if docs:
                    return docs
            except Exception:
                pass
        return self.local_cache.get("destinations", [])

    def get_destination_by_id(self, dest_id: str) -> Optional[Dict[str, Any]]:
        dests = self.get_destinations()
        for d in dests:
            if d.get("id") == dest_id:
                return d
        return None

    def get_states(self) -> List[Dict[str, Any]]:
        if self.is_mongo_connected and self.db is not None:
            try:
                docs = list(self.db.states.find({}, {"_id": 0}))
                if docs:
                    return docs
            except Exception:
                pass
        return self.local_cache.get("states", [])

    def get_hidden_gems(self) -> List[Dict[str, Any]]:
        if self.is_mongo_connected and self.db is not None:
            try:
                docs = list(self.db.hidden_gems.find({}, {"_id": 0}))
                if docs:
                    return docs
            except Exception:
                pass
        return self.local_cache.get("hidden_gems", [])

    def get_food(self) -> List[Dict[str, Any]]:
        if self.is_mongo_connected and self.db is not None:
            try:
                docs = list(self.db.food.find({}, {"_id": 0}))
                if docs:
                    return docs
            except Exception:
                pass
        return self.local_cache.get("food", [])

    def get_festivals(self) -> List[Dict[str, Any]]:
        if self.is_mongo_connected and self.db is not None:
            try:
                docs = list(self.db.festivals.find({}, {"_id": 0}))
                if docs:
                    return docs
            except Exception:
                pass
        return self.local_cache.get("festivals", [])

    def get_transport(self) -> Dict[str, Any]:
        return self.local_cache.get("transportation", {})

    def get_budget_benchmarks(self) -> Dict[str, Any]:
        return self.local_cache.get("budget_benchmarks", {})

db_store = DatabaseStore()
