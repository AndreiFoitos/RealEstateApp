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

## Requirements Checklist

### Backend (FastAPI)
- `POST /properties` – create a new property
- `GET /properties` – list all properties
- `GET /properties/{id}` – get a single property
- `PUT /properties/{id}` – update a property
- `DELETE /properties/{id}` – delete a property
- `GET /properties/{id}/energy` – returns simulated energy data
- Input validation via Pydantic (`floor_area_m2 > 0`, required fields, range checks)
- Proper HTTP status codes (404 on missing resources, 422 on validation errors)
- Reasonable project structure (`app/routes/`, `app/schemas.py`, `app/energy.py`)

### Frontend (Next.js)
- Property list page with name, type, address; links to view/edit/delete
- Create property form with client-side validation
- Edit property form pre-filled with existing data
- Property detail page showing all fields plus energy chart and daily readings table
- Area chart (Recharts) and summary stats (total, average, peak kWh)

### Nice-to-haves implemented
- Energy stats: total/average/peak kWh shown on detail page
- Basic backend tests (pytest) and CI pipeline (GitHub Actions)
- Docker setup (`docker-compose.yml`, `Dockerfile` for both services)

---

## Stack & Decisions


### Energy simulation approach
Data is generated when a property is created (and regenerated on update) for the last 30 days. The formula combines:
- Property type multiplier — offices have a higher base rate than apartments
- Building age efficiency factor — older buildings use more energy (no modern insulation)
- Inhabitant factor — uses `sqrt(n)` to model diminishing returns per person
- Volume factor — ceiling height increases the heated/cooled volume
- Weekday pattern — offices drop to 40 % on weekends; residential rises slightly
- Seeded random variation — 15 % noise seeded on `property_id` for reproducibility

---

## Data Model

### Properties Table
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key, auto-generated by Supabase |
| `name` | text | Required |
| `address` | text | Required |
| `type` | text | `apartment`, `office`, or `house` |
| `floor_area_m2` | float | Required, must be > 0 |
| `year_of_construction` | int | 1800–2030 |
| `number_of_inhabitants` | int | 0–50 |
| `ceiling_height_m` | float | 1.5–6.0 m |
| `created_at` | timestamptz | Auto-set by Supabase |

### Energy Data Table
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `property_id` | UUID | Foreign key → properties |
| `date` | date | ISO date string |
| `kwh` | float | Simulated consumption |
| `created_at` | timestamptz | Auto-set by Supabase |

### Supabase SQL to create the tables
```sql
create table properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  type text not null,
  floor_area_m2 float not null,
  year_of_construction int not null,
  number_of_inhabitants int not null,
  ceiling_height_m float not null,
  created_at timestamptz default now()
);

create table energy_data (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  date date not null,
  kwh float not null,
  created_at timestamptz default now()
);
```

---

## Environment Variables

### Backend (`.env` in `/backend`)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Frontend (`.env.local` in `/frontend`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Running Locally (without Docker)

### 1. Backend

```bash
cd backend

python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

uvicorn app.main:app --reload
```
### 2. Frontend

```bash
cd frontend

npm install

npm run dev
```

### 3. Seed sample data (optional)

With the backend running:

```bash
python seed.py
```

This creates 13 sample properties (apartments, houses, offices) in Groningen with realistic data.


## Running with Docker

Both services are containerised. The frontend image uses a multi-stage build (deps → builder → runner) to produce a minimal production image via Next.js standalone output.

### Prerequisites
- Docker and Docker Compose installed
- A `.env` file in the **project root** with your Supabase credentials

### 1. Create the root `.env` file

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Build and start both services

```bash
docker compose up --build
```


The backend includes a healthcheck, the frontend container waits for it to pass before starting, so the API is always ready when the UI loads.


### Docker architecture notes
- The backend Dockerfile is a simple single-stage image.
- The frontend Dockerfile uses a 3-stage build: `deps` (install npm packages), `builder` (run `next build`), and `runner` (copy only the standalone output). This results in a significantly smaller final image.

---

## API Reference

All routes are prefixed with `/api`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/properties` | List all properties |
| `POST` | `/api/properties` | Create a property |
| `GET` | `/api/properties/{id}` | Get a single property |
| `PUT` | `/api/properties/{id}` | Update a property (regenerates energy data) |
| `DELETE` | `/api/properties/{id}` | Delete a property |
| `GET` | `/api/properties/{id}/energy` | Get 30-day energy readings |

---


## CI/CD

GitHub Actions runs on every push/PR to `main`:
1. **Backend job** — lints with `ruff`, runs `pytest`
2. **Frontend job** — runs ESLint and `tsc --noEmit`
3. **Docker job** (runs after both pass) — builds both images to verify the Dockerfiles are valid

---

## Trade-offs & Future Improvements

### Trade-offs made
- No authentication
- Stored energy data
- Client-side data fetching only 

### What I would improve with more time
- Add user authentication (Supabase Auth) so each user sees only their own properties
- Add filtering and sorting on the property list (by type, area, energy consumption)
- Replace the stored energy table with on-the-fly generation to simplify the data model
- Add frontend tests 
- Show a broader date range on the energy chart
- Add basic seasonality to the energy simulation (higher usage in winter months)

