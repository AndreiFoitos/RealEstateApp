# Full‑stack Take‑home – Real Estate Energy Dashboard

## Objective

Build a small full‑stack application where users can manage **real estate objects** and view **simulated energy data** per object. The app should expose a REST API (FastAPI) and a web UI (Next.js) that consumes this API.
The goal is to see how you design APIs, model data, structure a frontend, and communicate trade‑offs – not to produce a perfect production system.
---

## Scope & Expectations

- Role: Medior full‑stack developer.
- Time: Please spend **no more than 4–6 hours**.
- It is OK to:
  - Leave parts as TODOs.
  - Skip non‑essential features.
  - Prefer clean, well‑structured code over visual polish.
We will go through your solution and decisions in a follow‑up conversation.

---

## Stack

Please use:

- Backend: **FastAPI** (Python).
- Frontend: **Next.js** (React).
- Database: **Postgres**, ideally via **Supabase** (local Postgres in Docker is also fine).
- DB access: your choice (e.g. SQLAlchemy, Supabase client, or similar).
If you deviate from this (e.g. no Supabase), mention it in the README.

---

## Domain & Data Model

### Real estate object

Each property should at least have:

- `id` (UUID or integer)
- `name` (e.g. "Apartment Groningen Center")
- `address` (string)
- `type` (e.g. `"apartment"`, `"office"`, `"house"`)
- `floor_area_m2` (number)

You may add more fields if they help your design (e.g. `construction_year`).
### Energy data (simulated)

For each property, expose **simulated** energy usage over time, for example:

- Daily or monthly electricity consumption in kWh.
- Return a simple timeseries like:  
  `[{ "date": "2025-01-01", "kwh": 23.5 }, ...]`.
You can generate this on the fly or store generated values; please describe your approach.

---

## Backend Requirements (FastAPI)

Implement at least:

**Real estate CRUD**

- `POST /properties` – create a new property.
- `GET /properties` – list all properties.
- `GET /properties/{id}` – get a single property.
- `PUT /properties/{id}` – update a property.
- `DELETE /properties/{id}` – delete a property.
**Energy data**

- `GET /properties/{id}/energy`  
  Returns simulated energy data for a given property (e.g. last 12 months or last 30 days).
**General**

- Input validation (e.g. required fields, positive `floor_area_m2`).
- Proper HTTP status codes and basic error handling (404 when a property does not exist, etc.).
- Reasonable project structure.

---

## Frontend Requirements (Next.js)

Build a small UI that consumes your API:

1. **Property list page**
   - Shows all properties (name, type, address).
   - Link/button to:
     - View property detail.
     - Create a new property.
   - Optional: edit/delete directly from this view.
2. **Create / edit property**
   - Form mapped to your backend fields.
   - Simple client‑side validation for required fields.

3. **Property detail with energy data**
   - Show property details.
   - Fetch and display energy data from `GET /properties/{id}/energy`.
   - Display as a table or a simple chart (line/bar) – choose what you can implement comfortably in the time.
Use any styling approach you like (Tailwind, shadcn/ui, plain CSS, etc.).

---

## Energy Simulation Notes

You are free to choose how to simulate data, for example:

- Generate daily values for the last 30 days using a seeded random function based on property id.
- Generate and store a timeseries when the property is created.
- Add basic seasonality if you like (e.g. higher usage in winter months).Please describe your approach briefly in the README.

---

## Nice‑to‑have (Optional)

Only if you have time:

- Filtering/sorting properties (e.g. by type).
- Total/average kWh over the selected period.
- A few basic tests (backend or frontend).
- Simple Docker setup or deployment (Supabase/Vercel).
Do not feel obliged to implement these.

---

## How to Submit

Please send us:

1. A link to your **Git repository** (GitHub/GitLab/etc.).
2. This **README** updated with:
   - How to run the backend.
   - How to run the frontend.
   - Any required environment variables or migrations.
   - A short note on trade‑offs and what you would improve with more time.


## UPDATES


### Backend

1. Navigate to backend directory:
```bash
   cd backend
```

2. Create and activate virtual environment:
```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1
```

3. Install dependencies:
```bash
   pip install -r requirements.txt
```

4. Configure environment variables:
   - Edit .env file
   - Add your Supabase database URL

5. Run the server:
```bash
   uvicorn app.main:app --reload
```

   API will be available at http://localhost:8000
   API docs at http://localhost:8000/docs

### Frontend

1. Navigate to frontend directory:
```bash
   cd frontend
```

2. Install dependencies:
```bash
   npm install
```

3. Configure environment variables:
   - Create .env.local
   - Add `NEXT_PUBLIC_API_URL=http://localhost:8000`

4. Run the development server:
```bash
   npm run dev
```

   App will be available at http://localhost:3000

## Database Schema

### Properties Table
- `id`: UUID (primary key)
- `name`: String
- `address`: String
- `type`: String (apartment, office, house)
- `floor_area_m2`: Float
- `created_at`: Timestamp

### Energy Readings Table
- `id`: UUID (primary key)
- `property_id`: UUID (foreign key)
- `date`: Date
- `kwh`: Float
- `created_at`: Timestamp

## API Endpoints

- `POST /properties` - Create property
- `GET /properties` - List all properties
- `GET /properties/{id}` - Get single property
- `PUT /properties/{id}` - Update property
- `DELETE /properties/{id}` - Delete property
- `GET /properties/{id}/energy` - Get energy data

## Energy Simulation

Energy data is generated when a property is created:
- 30 days of historical data
- Based on floor area (larger properties consume more)
- Random variation to simulate real usage patterns
- Stored in database for consistency

## Trade-offs & Future Improvements

### Trade-offs Made
- Simple table display instead of charts (time constraint)
- Stored energy data instead of real-time calculation (better performance)
- Basic validation (would add more comprehensive checks)

### Future Improvements
- Add user authentication
- Implement filtering and sorting
- Add data visualization (charts)
- Unit and integration tests
- Pagination for large datasets
- Advanced energy analytics
