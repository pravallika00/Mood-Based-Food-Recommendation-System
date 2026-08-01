from fastapi import APIRouter, File, UploadFile
import numpy as np
import cv2
from tensorflow.keras.models import load_model
from utils.food_mapping import food_map

router = APIRouter()

# Load model and OpenCV face detector
try:
    model = load_model("models/face_model.h5")
except:
    print("Warning: face_model.h5 not found. Please ensure model files are in the models directory.")
    model = None

# Use OpenCV's Haar Cascade for face detection instead of dlib
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
class_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

def preprocess_face_opencv(img, face_rect):
    """Preprocess face using OpenCV instead of dlib"""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    (x, y, w, h) = face_rect
    face_img = gray[y:y + h, x:x + w]
    face_img = cv2.resize(face_img, (48, 48))
    face_img = face_img.astype("float32") / 255.0
    face_img = np.expand_dims(face_img, axis=-1)
    return face_img

@router.post("/")
def predict_face_emotion(file: UploadFile = File(...)):
    if model is None:
        return {"error": "Face emotion model not loaded"}
        
    try:
        contents = file.file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Use OpenCV for face detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) == 0:
            return {"error": "No face detected"}

        # Use the first detected face
        face_rect = faces[0]
        face_img = preprocess_face_opencv(img, face_rect)
        preds = model.predict(np.expand_dims(face_img, axis=0), verbose=0)
        emotion = class_labels[np.argmax(preds)]
        food = food_map.get(emotion, "No suggestion available")

        return {
            "emotion": emotion,
            "food_recommendation": food,
            "confidence": float(np.max(preds))
        }
    except Exception as e:
        return {"error": f"Processing failed: {str(e)}"}