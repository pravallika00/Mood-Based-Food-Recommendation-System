# utils/voice_utils.py
import librosa
import numpy as np
import tempfile

def preprocess_audio(file):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name
    audio, sr = librosa.load(tmp_path, sr=16000)
    return audio, sr


