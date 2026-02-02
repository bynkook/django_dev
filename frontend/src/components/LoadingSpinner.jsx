import React from 'react';

const LoadingSpinner = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const borderClasses = {
    sm: 'border-2',
    md: 'border-2',
    lg: 'border-3',
    xl: 'border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${borderClasses[size]} 
          border-gray-200 
          border-t-blue-500 
          rounded-full 
          animate-spin
        `} 
      />
      {message && (
        <p className="text-sm text-[var(--text-secondary)] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
