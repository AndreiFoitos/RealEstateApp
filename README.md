# RealEstateApp

A full-stack application for managing real estate objects and viewing energy data.

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Next.js (React, TypeScript)
- **Database**: Supabase (PostgreSQL)

## Setup Instructions

### Backend

1. Navigate to backend directory:
```bash
   cd backend
```

2. Create and activate virtual environment:
```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # Windows PowerShell
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
- `kwh_consumed`: Float
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
