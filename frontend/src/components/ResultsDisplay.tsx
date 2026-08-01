import React from 'react';
import { FiSmile, FiFrown, FiMeh, FiAlertCircle, FiZap, FiHeart } from 'react-icons/fi';
import type { PredictionResponse } from '../types/api';

interface ResultsDisplayProps {
  result: PredictionResponse;
  onReset: () => void;
}

const emotionIcons: Record<string, React.ReactNode> = {
  'Happy': <FiSmile className="w-8 h-8 text-yellow-500" />,
  'Sad': <FiFrown className="w-8 h-8 text-blue-500" />,
  'Angry': <FiAlertCircle className="w-8 h-8 text-red-500" />,
  'Fear': <FiZap className="w-8 h-8 text-purple-500" />,
  'Surprise': <FiHeart className="w-8 h-8 text-pink-500" />,
  'Disgust': <FiFrown className="w-8 h-8 text-green-500" />,
  'Neutral': <FiMeh className="w-8 h-8 text-gray-500" />,
};

const emotionColors: Record<string, string> = {
  'Happy': 'bg-yellow-100 border-yellow-300',
  'Sad': 'bg-blue-100 border-blue-300',
  'Angry': 'bg-red-100 border-red-300',
  'Fear': 'bg-purple-100 border-purple-300',
  'Surprise': 'bg-pink-100 border-pink-300',
  'Disgust': 'bg-green-100 border-green-300',
  'Neutral': 'bg-gray-100 border-gray-300',
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  const emotionColor = emotionColors[result.emotion] || 'bg-gray-100 border-gray-300';
  const icon = emotionIcons[result.emotion] || <FiMeh className="w-8 h-8 text-gray-500" />;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`rounded-lg border-2 p-8 ${emotionColor}`}>
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            {icon}
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {result.emotion}
            </h2>
            {result.confidence && (
              <p className="text-gray-600">
                Confidence: {(result.confidence * 100).toFixed(1)}%
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Food Recommendations
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {result.food_recommendation}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={onReset}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;