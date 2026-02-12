from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import properties  # presupun că routerul tău e aici

app = FastAPI(title="Property Energy API")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend-ul tău
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router cu prefix /api
app.include_router(properties.router, prefix="/api", tags=["properties"])
