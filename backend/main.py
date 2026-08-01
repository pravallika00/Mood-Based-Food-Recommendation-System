# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import face_emotion, voice_emotion, sentiment_analysis

app = FastAPI(title="Multimodal Emotion Detection API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(face_emotion.router, prefix="/predict/face")
app.include_router(voice_emotion.router, prefix="/predict/voice")
app.include_router(sentiment_analysis.router, prefix="/predict/sentiment")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Multimodal Emotion Detection API"}
