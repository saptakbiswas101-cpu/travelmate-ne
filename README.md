# TravelMateNE — Explore Northeast India
> *"Discover the Northeast. Beyond the ordinary."*

TravelMateNE is a modern, premium dark travel-tech web application built for discovering, navigating, and planning immersive journeys across all eight sister states of Northeast India: **Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, and Sikkim**.

Inspired by Halo Lab's signature dark aesthetic, TravelMateNE incorporates subtle regional cultural motifs (Assamese Gamusa patterns, Muga silk gold, Jaapi motifs) with functional travel discovery tools, interactive OpenStreetMap GIS maps, an intelligent day-by-day AI trip planner, and a realistic budget estimation engine.

---

## 1. Project Folder Structure

```
TravelmateNE/
├── backend/
│   ├── config.py                 # Environment configurations & defaults
│   ├── database.py               # MongoDB Atlas connection & JSON fallback engine
│   ├── main.py                   # FastAPI application, CORS, and health probe
│   ├── seed.py                   # MongoDB Atlas database seeding utility
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Sample environment variables
│   ├── models/
│   │   └── schemas.py            # Pydantic schemas (Destinations, Itinerary, Budget, Auth)
│   ├── routes/
│   │   ├── destinations.py       # GET /api/destinations & /api/destinations/{id}
│   │   ├── states.py             # GET /api/states & /api/states/{id}
│   │   ├── hidden_gems.py        # GET /api/hidden-gems
│   │   ├── food.py               # GET /api/food
│   │   ├── festivals.py          # GET /api/festivals
│   │   ├── trip_planner.py       # POST /api/trip-planner
│   │   ├── budget.py             # POST /api/budget/calculate
│   │   ├── transport.py          # GET /api/transport
│   │   └── auth.py               # Auth & Bookmarks API
│   ├── services/
│   │   ├── ai_planner.py         # Google Gemini API & Curated Rule-Based Fallback
│   │   ├── budget_engine.py      # Itemized budget calculation algorithm
│   │   └── auth_service.py       # Salted SHA-256 hashing & JWT tokens
│   └── data/                     # Verified Tourism Datasets (JSON)
│       ├── destinations.json     # 53 Curated destinations with lat/lng
│       ├── hidden_gems.json      # 22 Offbeat secrets
│       ├── food.json             # 32 Traditional dishes (Veg & Non-Veg)
│       ├── festivals.json        # 27 Regional festivals (Fixed & Lunar)
│       ├── states.json           # 8 States profiles & ILP permit rules
│       ├── transportation.json   # Airports, rail, roads & border permits
│       └── budget_benchmarks.json# Seasonal cost benchmarks
├── frontend/
│   ├── package.json              # React 18, Vite, Tailwind CSS, Leaflet, Lucide
│   ├── vite.config.js            # Vite config with API proxy
│   ├── tailwind.config.js        # Halo Lab dark palette & typography
│   ├── postcss.config.js         # PostCSS config
│   ├── index.html                # Entry HTML with Leaflet CSS & Google Fonts
│   └── src/
│       ├── index.css             # Glassmorphism, glow effects, Gamusa borders
│       ├── main.jsx              # App entry point
│       ├── App.jsx               # React Router routes
│       ├── components/
│       │   ├── Navbar.jsx        # Glassmorphic header with saved counter & auth
│       │   ├── Footer.jsx        # Regional footer with ILP links & disclaimers
│       │   ├── DestinationCard.jsx # Rounded destination card with bookmarking
│       │   ├── StateCard.jsx     # State card with permits badge
│       │   ├── InteractiveMap.jsx# Leaflet OpenStreetMap with custom dark pins
│       │   ├── GamusaBanner.jsx  # Assamese Gamusa woven motif trim
│       │   └── AuthModal.jsx     # Login/Register modal with 1-click Demo Mode
│       ├── context/
│       │   └── AuthContext.jsx   # State management for auth, bookmarks & plans
│       ├── services/
│       │   └── api.js            # API client with automatic offline fallback
│       ├── pages/
│       │   ├── HomePage.jsx      # Cinematic hero, state grid, popular spots, gems
│       │   ├── DestinationsPage.jsx # Search, multi-filters & sorting
│       │   ├── DestinationDetailPage.jsx # Rich overview, activities, mini-map, ILP warnings
│       │   ├── StatesPage.jsx    # Overview of all 8 Sister States
│       │   ├── StateDetailPage.jsx # State deep dive (top spots, food, festivals)
│       │   ├── HiddenGemsPage.jsx# 22 offbeat secrets with responsible travel tips
│       │   ├── TripPlannerPage.jsx # AI day-by-day planner with printable export
│       │   ├── BudgetCalculatorPage.jsx # Interactive multi-tier cost calculator
│       │   ├── CultureExplorerPage.jsx # 32 local dishes & 27 festivals catalog
│       │   ├── InteractiveMapPage.jsx # Full-screen GIS map with driving directions
│       │   └── SavedItemsPage.jsx# Bookmarked destinations & saved trip plans
│       └── data/                 # Mirrored local JSON datasets for offline operation
├── generate_datasets.py          # Script that generates & validates datasets
├── start_dev.bat                 # Windows CMD one-click runner
├── start_dev.ps1                 # Windows PowerShell one-click runner
└── README.md
```

---

## 2. Completed Features

### 1. Visual Design & Theme (Halo Lab Inspired)
- **Palette**: Dark primary (`#090A0B`), secondary (`#151319`), deep plum (`#30213D`), forest sage (`#A2B091`), electric violet (`#8844C9`), earth gold (`#B97B34`), and text (`#DADCD3`).
- **Northeast Cultural Touches**: Geometric Assamese Gamusa woven border accents, Muga silk gold badges, and tribal pattern trims.
- **Glassmorphism & Micro-animations**: Subtle card lift effects, glowing highlights, and responsive layouts across desktop and mobile.

### 2. Homepage (Full 11 Sections)
- **Hero Section**: High-resolution photography, live search bar, quick popular filters, and dual CTAs.
- **Explore 8 States**: Interactive cards for all 8 states with capital, nickname, highlights, and permit tags.
- **Popular Destinations**: Filterable cards by category (Wildlife, Nature, Cultural, Historical, Adventure).
- **Hidden Gems**: Curated offbeat secrets with "Why It's Worth Visiting" cards.
- **Smart Trip Planner Banner**: Direct entry point into AI itinerary generation.
- **Culture & Cuisine Spotlight**: Traditional Assamese, Naga, Khasi, and Meitei dishes.
- **Interactive Geospatial Map Preview**: Live OpenStreetMap showing destination coordinates.
- **Budget Benchmarks**: Backpacker, Comfort, and Luxury expense tiers.

### 3. Destination Explorer & Detail Pages
- Search by destination name, district, or landmark.
- Multi-filter by State, Category, and Sort by Name or State.
- Detailed view with:
  - Exact coordinates plotted on an interactive Leaflet mini-map.
  - "Get Directions" link straight to Google Maps / OpenStreetMap.
  - Recommended duration, best visiting season, and estimated budget.
  - Checklist of top activities and accessibility information.
  - Crucial travel precautions and Inner Line Permit (ILP) guidance.
  - "Save Destination" and "Plan Trip with this Destination" actions.

### 4. AI Smart Trip Planner (Gemini & Fallback Engine)
- Inputs: Starting city, preferred states, number of travellers, travel days (1-15), travel month, budget in INR, and travel style.
- Outputs:
  - Day-by-day morning, afternoon, and evening schedule.
  - Suggested stay (eco-homestays, mountain cottages, tea bungalows).
  - Transit instructions between districts.
  - Itemized financial breakdown (Lodging, Transport, Food, Activities, Contingency).
  - Total estimated cost vs. user budget comparison.
  - Regional safety precautions (permits, altitude, weather, cash advisory).
  - Alternative budget-saving strategies.
  - Printable / Export PDF feature.
  - One-click "Save Itinerary" saved to user profile.
- **Dual Engine Architecture**: Connects to Google Gemini API (`gemini-1.5-flash`) when `GEMINI_API_KEY` is configured; seamlessly switches to our curated rule-based Northeast expert engine if the key is absent or offline.

### 5. Interactive Budget Calculator
- Live interactive sliders for trip duration (2-21 days) and group size (1-12 travellers).
- Selectors for accommodation tier, transportation type, dining style, and activity level.
- Dynamic instant calculation of:
  - Itemized cost breakdown (accommodation, food, local transit, intercity, activities, buffer).
  - Per-person cost and daily cost per person.
  - Comparison against regional benchmarks (Backpacker, Comfort, Luxury).
  - Northeast-specific money-saving recommendations.

### 6. Culture & Food Explorer
- **Traditional Food (32 Dishes)**:
  - Covers Assamese, Monpa, Khasi, Meitei, Mizo, Naga, Tripuri, and Sikkimese cuisines.
  - Filter by State and Vegetarian / Non-Vegetarian.
  - Detailed ingredients, community associations, and taste profiles.
- **Festivals Calendar (27 Celebrations)**:
  - Fixed-date vs. Lunar/variable date indicators.
  - Celebration months, cultural significance, and primary locations.

### 7. Interactive Geospatial Map (OpenStreetMap & Leaflet)
- Custom dark CartoDB tile theme.
- Color-coded pins for each category (Wildlife, Nature, Cultural, Historical, Spiritual, Adventure, Offbeat).
- Marker popups with thumbnails, budget, season, and direct link to turn-by-turn navigation.
- State and category filters directly on the map toolbar.

### 8. Authentication & Saved Collection
- User registration and login using salted SHA-256 password hashing.
- **Hackathon Demo Mode**: 1-click demo login button pre-filling credentials (`demo@travelmatene.com` / `northeast2026`).
- Bookmarking destinations with heart toggles.
- Saved AI itineraries stored in profile, accessible online and offline.

---

## 3. Dataset Statistics

| Dataset | Count | Coverage | Key Highlights |
| :--- | :---: | :--- | :--- |
| **States** | **8** | All 8 Sister States | Capital, nickname, permit status, coordinates, cultural symbols |
| **Destinations** | **53** | Distributed across 8 states | Exact lat/long, season, duration, budget, activities, precautions |
| **Hidden Gems** | **22** | Offbeat spots across 8 states | "Why worth visiting", accessibility, responsible travel ethics |
| **Local Food** | **32** | 8 States & indigenous tribes | Veg/Non-veg classification, ingredients, taste profiles |
| **Festivals** | **27** | 8 States | Bihu, Hornbill, Ziro Festival, Wangala 100 Drums, Losar, Sangai |
| **Airports & Transit**| **15** | Regional hubs | GAU, IXA, IMF, HGI, AJL, DMU, SHL, PYG, DIB, JRH & rail gateways |

---

## 4. Environment Variables Required

### Backend (`backend/.env`):
```env
PORT=8000
HOST=0.0.0.0

# Optional: MongoDB Atlas connection URI (Leave blank for local JSON data mode)
MONGODB_URI=

# Optional: Google Gemini API Key for AI Trip Planner
# If blank, TravelMateNE uses its curated rule-based engine automatically
GEMINI_API_KEY=

DATABASE_NAME=travelmatene
JWT_SECRET=travelmatene-secret-key-2026-northeast
CORS_ORIGINS=*
```

### Frontend (`frontend/.env`):
```env
VITE_API_URL=/api
```

---

## 5. How to Run Frontend and Backend

### Option A: Using the One-Click Scripts (Windows)
Double-click `start_dev.bat` or run in PowerShell:
```powershell
.\start_dev.ps1
```

### Option B: Running Manually

#### Step 1: Start the Backend (Terminal 1)
```bash
# Navigate to project root
cd "c:\Users\saptak biswas\Downloads\TravelmateNE"

# Run FastAPI with uvicorn
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
- API will be accessible at: `http://localhost:8000`
- Interactive Swagger API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

#### Step 2: Start the Frontend (Terminal 2)
```bash
# Navigate to frontend
cd "c:\Users\saptak biswas\Downloads\TravelmateNE\frontend"

# Launch Vite dev server
pnpm run dev
# OR: npx vite
```
- Open your browser at: `http://localhost:5173`

---

## 6. MongoDB Atlas Setup Instructions

TravelMateNE includes an **auto-fallback local JSON storage engine**. If you do not have MongoDB configured, the app runs with zero errors.

To connect your own MongoDB Atlas cluster:
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a database user and password.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) or your IP.
4. Copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```
5. Set `MONGODB_URI` in `backend/.env`.
6. Run the database seeding script:
   ```bash
   python backend/seed.py
   ```
   This will automatically import all 53 destinations, 8 states, 22 hidden gems, 32 dishes, and 27 festivals into your MongoDB Atlas collections!

---

## 7. Deployment Instructions

### Frontend on Vercel:
1. Push the code to a GitHub repository.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository and set the **Root Directory** to `frontend`.
4. Framework Preset: **Vite**.
5. Build Command: `pnpm run build` (or `npm run build`).
6. Output Directory: `dist`.
7. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://travelmatene-api.onrender.com/api`).
8. Deploy!

### Backend on Render:
1. Log into [Render](https://render.com) and select **New Web Service**.
2. Connect your repository.
3. Root Directory: `.` (or empty).
4. Environment: **Python 3**.
5. Build Command: `pip install -r backend/requirements.txt`
6. Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
7. Add Environment Variables:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `MONGODB_URI`: Your MongoDB Atlas URI.
   - `JWT_SECRET`: Random secure string.
8. Deploy!

---

## 8. Known Limitations & Features Needing Real-World Verification

1. **Inner Line Permit (ILP) Processing**:
   - The platform provides direct verified links to the state government portals (Arunachal, Nagaland, Mizoram, Manipur) and explains exact requirements. However, official ILPs must be issued by the respective state home departments; the application cannot issue legal entry permits directly.
2. **Dynamic Fuel & Road Conditions**:
   - Mountain routes in Northeast India (e.g., Sela Pass in winter, Teesta NH10 during heavy monsoons) are subject to weather-induced closures. While TravelMateNE highlights these in precautions, live road status depends on daily Border Roads Organisation (BRO) bulletins.
3. **Transportation Schedules**:
   - TravelMateNE explicitly lists major airport routes, railway terminals, and typical shared Sumo durations without inventing live timetable schedules. Travellers should verify live train timings on IRCTC and flight schedules with airlines.
4. **Price Estimates**:
   - All budget benchmarks, hotel estimates, and cab rates are clearly marked as illustrative estimates based on 2025-2026 Northeast travel averages. Rates naturally vary during peak festivals (such as the Hornbill Festival in December, when accommodations in Kohima carry high demand premiums).
