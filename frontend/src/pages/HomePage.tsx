import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMic, FiHeart, FiMessageSquare } from 'react-icons/fi';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-500 p-4 rounded-full">
              <FiHeart className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Emotion Detection & Food Recommendations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your emotional state through face or voice analysis and get personalized food recommendations to match your mood.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link
            to="/face-emotion"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full"
          >
            <div className="p-8 text-center flex flex-col h-full">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <FiUser className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Face Emotion Detection
              </h2>
              <p className="text-gray-600 mb-6">
                Upload a photo or use your camera to analyze facial expressions and detect emotions.
              </p>
              <div className="mt-auto">
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg inline-block font-medium">
                  Start Face Analysis →
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/voice-emotion"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full"
          >
            <div className="p-8 text-center flex flex-col h-full">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <FiMic className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Voice Emotion Detection
              </h2>
              <p className="text-gray-600 mb-6">
                Record your voice or upload an audio file to analyze vocal patterns and detect emotions.
              </p>
              <div className="mt-auto">
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg inline-block font-medium">
                  Start Voice Analysis →
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/sentiment"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full"
          >
            <div className="p-8 text-center flex flex-col h-full">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <FiMessageSquare className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Text Sentiment Analysis
              </h2>
              <p className="text-gray-600 mb-6">
                Enter text to analyze its sentiment as positive or negative.
              </p>
              <div className="mt-auto">
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg inline-block font-medium">
                  Start Text Analysis →
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-lg">1</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Choose Method</h4>
              <p className="text-gray-600 text-sm">
                Select face or voice emotion detection based on your preference.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-lg">2</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Analyze</h4>
              <p className="text-gray-600 text-sm">
                Our AI analyzes your input using advanced machine learning models.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-lg">3</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Get Recommendations</h4>
              <p className="text-gray-600 text-sm">
                Receive personalized food suggestions based on your detected emotion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;