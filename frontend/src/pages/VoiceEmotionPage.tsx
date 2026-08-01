import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiMic } from 'react-icons/fi';
import FileUpload from '../components/FileUpload';
import AudioRecorder from '../components/AudioRecorder';
import ResultsDisplay from '../components/ResultsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { predictVoiceEmotion } from '../services/api';
import type { PredictionResponse } from '../types/api';

type AnalysisState = 'idle' | 'loading' | 'success' | 'error';

const VoiceEmotionPage: React.FC = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('record');

  const handleAudioAnalysis = async (file: File) => {
    setAnalysisState('loading');
    setError('');
    
    try {
      const response = await predictVoiceEmotion(file);
      setResult(response);
      setAnalysisState('success');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze voice emotion');
      setAnalysisState('error');
    }
  };

  const handleReset = () => {
    setAnalysisState('idle');
    setResult(null);
    setError('');
  };

  if (analysisState === 'success' && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <ResultsDisplay result={result} onReset={handleReset} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Voice Emotion Detection
            </h1>
            <p className="text-gray-600">
              Record your voice or upload an audio file to detect emotions from vocal patterns.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('record')}
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    activeTab === 'record'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiMic className="w-5 h-5 inline-block mr-2" />
                  Record Audio
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    activeTab === 'upload'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiUpload className="w-5 h-5 inline-block mr-2" />
                  Upload Audio
                </button>
              </nav>
            </div>

            <div className="p-8">
              {analysisState === 'loading' ? (
                <LoadingSpinner message="Analyzing voice patterns..." />
              ) : analysisState === 'error' ? (
                <div className="text-center">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {activeTab === 'record' ? (
                    <AudioRecorder
                      onRecordingComplete={handleAudioAnalysis}
                      disabled={false}
                    />
                  ) : (
                    <FileUpload
                      onFileSelect={handleAudioAnalysis}
                      accept="audio/*"
                      label="Upload an audio file"
                      disabled={false}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips for Best Results</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Speak clearly and naturally</li>
              <li>• Record in a quiet environment</li>
              <li>• Keep recordings between 3-10 seconds</li>
              <li>• Express your emotions naturally while speaking</li>
              <li>• Supported formats: WAV, MP3, M4A</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceEmotionPage;