import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Analyzing...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;