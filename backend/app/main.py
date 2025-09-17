from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.data import router as data_router

app = FastAPI(title="Bitcoin Trading Dashboard API", version="1.0.0")

# Add CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Bitcoin Trading Dashboard API"}