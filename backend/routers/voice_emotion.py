# routers/voice_emotion.py
from fastapi import APIRouter, File, UploadFile
import torch
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2Processor
from utils.voice_utils import preprocess_audio
from utils.food_mapping import food_map

router = APIRouter()
model = Wav2Vec2ForSequenceClassification.from_pretrained("models/voice_model")
processor = Wav2Vec2Processor.from_pretrained("models/voice_model")
model.eval()

label_map = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

@router.post("/")
def predict_voice_emotion(file: UploadFile = File(...)):
    audio_input, sampling_rate = preprocess_audio(file)
    inputs = processor(audio_input, sampling_rate=sampling_rate, return_tensors="pt", padding=True)
    with torch.no_grad():
        logits = model(**inputs).logits
    prediction = torch.argmax(logits, dim=-1).item()
    emotion = label_map[prediction]
    food = food_map.get(emotion, "No suggestion available")
    return {"emotion": emotion, "food_recommendation": food}