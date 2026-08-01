export interface EmotionResult {
  emotion: string;
  food_recommendation: string;
  confidence?: number;
}

export interface ApiError {
  error: string;
}

export type EmotionType = 'Angry' | 'Disgust' | 'Fear' | 'Happy' | 'Sad' | 'Surprise' | 'Neutral';

export interface PredictionResponse {
  emotion: EmotionType;
  food_recommendation: string;
  confidence?: number;
}

export type SentimentLabel = 'negative' | 'positive';

export interface SentimentResponse {
  sentiment: SentimentLabel;
  confidence: number;
}