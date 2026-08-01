import axios from 'axios';
import type { PredictionResponse, SentimentResponse } from '../types/api';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const predictFaceEmotion = async (imageFile: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    const response = await api.post('/predict/face', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to analyze face emotion');
  }
};

export const predictVoiceEmotion = async (audioFile: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append('file', audioFile);

  try {
    const response = await api.post('/predict/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to analyze voice emotion');
  }
};

export const checkApiHealth = async (): Promise<{ message: string }> => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error('API is not available');
  }
};

export const predictTextSentiment = async (text: string): Promise<SentimentResponse> => {
  try {
    const response = await api.post('/predict/sentiment', { text });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error as string);
    }
    throw new Error('Failed to analyze text sentiment');
  }
};