import React, { useState } from 'react';
import { predictTextSentiment } from '../services/api';
import type { SentimentResponse } from '../types/api';
import LoadingSpinner from './LoadingSpinner';

type AnalysisState = 'idle' | 'loading' | 'success' | 'error';

interface SentimentAnalyzerProps {
  className?: string;
}

const SentimentAnalyzer: React.FC<SentimentAnalyzerProps> = ({ className = '' }) => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [result, setResult] = useState<SentimentResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [text, setText] = useState<string>('');

  const handleAnalyze = async () => {
    setError('');
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }
    setAnalysisState('loading');
    try {
      const response = await predictTextSentiment(text);
      setResult(response);
      setAnalysisState('success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to analyze text sentiment';
      setError(message);
      setAnalysisState('error');
    }
  };

  const handleReset = () => {
    setAnalysisState('idle');
    setResult(null);
    setError('');
    setText('');
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {analysisState === 'loading' ? (
        <LoadingSpinner message="Analyzing text sentiment..." />
      ) : analysisState === 'success' && result ? (
        <div className="text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
            <p className="text-2xl font-semibold text-green-700 capitalize">{result.sentiment}</p>
            <p className="text-gray-700">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Analyze Another
            </button>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
              {error}
            </div>
          )}
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Type or paste text here..."
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyze}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Analyze
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SentimentAnalyzer;
