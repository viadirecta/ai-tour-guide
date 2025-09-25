from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, tours, pois, uploads, ratings
from app.db.database import engine
from app.models import User, Tour, PointOfInterest, Multimedia, Rating, Tip

# Create database tables
User.metadata.create_all(bind=engine)
Tour.metadata.create_all(bind=engine)
PointOfInterest.metadata.create_all(bind=engine)
Multimedia.metadata.create_all(bind=engine)
Rating.metadata.create_all(bind=engine)
Tip.metadata.create_all(bind=engine)

app = FastAPI(
    title="QR Tour Guide API",
    description="API for self-guided tour application with QR codes",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tours.router)
app.include_router(pois.router)
app.include_router(uploads.router)
app.include_router(ratings.router)

@app.get("/")
def read_root():
    return {"message": "QR Tour Guide API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}