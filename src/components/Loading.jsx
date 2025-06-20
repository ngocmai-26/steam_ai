import React from 'react';

const Loading = ({ fullScreen }) => {
  const loadingContent = (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <span className="ml-2 text-indigo-600">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {loadingContent}
      </div>
    );
  }

  return loadingContent;
};

export default Loading; 