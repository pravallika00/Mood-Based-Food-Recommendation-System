import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiCamera } from 'react-icons/fi';
import FileUpload from '../components/FileUpload';
import CameraCapture from '../components/CameraCapture';
import ResultsDisplay from '../components/ResultsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { predictFaceEmotion } from '../services/api';
import type { PredictionResponse } from '../types/api';

type AnalysisState = 'idle' | 'loading' | 'success' | 'error';

const FaceEmotionPage: React.FC = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');

  const handleFileAnalysis = async (file: File) => {
    setAnalysisState('loading');
    setError('');
    
    try {
      const response = await predictFaceEmotion(file);
      setResult(response);
      setAnalysisState('success');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze face emotion');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
              Face Emotion Detection
            </h1>
            <p className="text-gray-600">
              Upload a photo or use your camera to detect emotions from facial expressions.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    activeTab === 'upload'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiUpload className="w-5 h-5 inline-block mr-2" />
                  Upload Photo
                </button>
                <button
                  onClick={() => setActiveTab('camera')}
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    activeTab === 'camera'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiCamera className="w-5 h-5 inline-block mr-2" />
                  Use Camera
                </button>
              </nav>
            </div>

            <div className="p-8">
              {analysisState === 'loading' ? (
                <LoadingSpinner message="Analyzing facial expressions..." />
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
                  {activeTab === 'upload' ? (
                    <FileUpload
                      onFileSelect={handleFileAnalysis}
                      accept="image/*"
                      label="Upload a photo"
                      disabled={false}
                    />
                  ) : (
                    <CameraCapture
                      onCapture={handleFileAnalysis}
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
              <li>• Ensure your face is clearly visible and well-lit</li>
              <li>• Look directly at the camera</li>
              <li>• Avoid wearing sunglasses or masks</li>
              <li>• Make sure the image is not blurry</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceEmotionPage;