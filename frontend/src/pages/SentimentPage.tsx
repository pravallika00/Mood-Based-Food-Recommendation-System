import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import SentimentAnalyzer from '../components/SentimentAnalyzer';
const SentimentPage: React.FC = () => {
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
              Text Sentiment Analysis
            </h1>
            <p className="text-gray-600">
              Enter text to analyze its sentiment.
            </p>
          </div>
          <SentimentAnalyzer />
        </div>
      </div>
    </div>
  );
};

export default SentimentPage;
