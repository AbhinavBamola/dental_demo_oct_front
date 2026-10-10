import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const spinnerSizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-slate-500">
      <div
        className={`${spinnerSizes[size]} rounded-full border-slate-200 border-t-ocean-600 animate-spin`}
        style={{ borderTopColor: '#0284C7' }}
      />
      {text && <p className="mt-3 text-sm font-medium text-slate-600 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
