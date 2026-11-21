import json
import os
import sys
from pymongo import MongoClient

def seed_mongodb():
    uri = os.getenv("MONGODB_URI", "")
    if not uri:
        print("INFO: No MONGODB_URI found in environment. Data runs seamlessly from backend/data/*.json files.")
        return

    db_name = os.getenv("DATABASE_NAME", "travelmatene")
    print(f"Connecting to MongoDB Atlas: {db_name}...")
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        db = client[db_name]
        print("Connected successfully!")
    except Exception as e:
        print(f"ERROR: Could not connect to MongoDB Atlas: {e}")
        return

    data_dir = os.path.join(os.path.dirname(__file__), "data")
    collections = {
        "destinations": "destinations.json",
        "states": "states.json",
        "hidden_gems": "hidden_gems.json",
        "food": "food.json",
        "festivals": "festivals.json"
    }

    for col_name, fname in collections.items():
        fpath = os.path.join(data_dir, fname)
        if os.path.exists(fpath):
            with open(fpath, "r", encoding="utf-8") as f:
                records = json.load(f)
            if records:
                db[col_name].delete_many({})
                db[col_name].insert_many(records)
                print(f"Imported {len(records)} records into collection: '{col_name}'")

    print("MongoDB Atlas database seeding complete!")

if __name__ == "__main__":
    seed_mongodb()
