import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EvaluationFlow from '../components/LessonEvaluation/EvaluationFlow';
import LessonEvaluationList from '../components/LessonEvaluation/LessonEvaluationList';

const Evaluations = () => {
  const [showFlow, setShowFlow] = useState(false);
  const navigate = useNavigate();

  if (showFlow) {
    return <EvaluationFlow onBack={() => setShowFlow(false)} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Đánh giá buổi học</h1>
        <button
          onClick={() => setShowFlow(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Thêm đánh giá
        </button>
      </div>
      <LessonEvaluationList />
    </div>
  );
};

export default Evaluations; 