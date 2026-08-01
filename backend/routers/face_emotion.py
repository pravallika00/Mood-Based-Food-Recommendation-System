from fastapi import APIRouter, File, UploadFile
import numpy as np
import cv2
import dlib
from imutils import face_utils
from tensorflow.keras.models import load_model
from utils.food_mapping import food_map

router = APIRouter()

# Load model and Dlib predictor with error handling
try:
    model = load_model("models/face_model/face_model.h5")
    print("Face model loaded successfully")
except Exception as e:
    print(f"Warning: Could not load face model: {e}")
    model = None

try:
    predictor = dlib.shape_predictor("models/face_model/shape_predictor_68_face_landmarks.dat")
    detector = dlib.get_frontal_face_detector()
    print("Dlib face detector loaded successfully")
except Exception as e:
    print(f"Warning: Could not load dlib predictor: {e}")
    predictor = None
    detector = None
class_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

def preprocess_face_dlib(img, face_rect):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    (x, y, w, h) = face_rect.left(), face_rect.top(), face_rect.width(), face_rect.height()
    face_img = gray[y:y + h, x:x + w]
    face_img = cv2.resize(face_img, (48, 48))
    face_img = face_img.astype("float32") / 255.0
    face_img = np.expand_dims(face_img, axis=-1)
    return face_img

@router.post("/")
def predict_face_emotion(file: UploadFile = File(...)):
    if model is None or detector is None:
        return {"error": "Face emotion model not available. Please check model files."}
    
    try:
        contents = file.file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        faces = detector(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))
        if not faces:
            return {"error": "No face detected"}

        face_img = preprocess_face_dlib(img, faces[0])
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
