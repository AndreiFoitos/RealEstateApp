from fastapi import FastAPI
from app.routes import properties

app = FastAPI()
app.include_router(properties.router)
