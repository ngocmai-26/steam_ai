import React, { useState } from 'react';

const LessonEvaluationForm = ({ lesson, student, onClose }) => {
  const [formData, setFormData] = useState({
    focus_score: 5,
    punctuality_score: 5,
    interaction_score: 5,
    comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit evaluation data
    console.log('Submitting evaluation:', {
      lesson_id: lesson?.id,
      student_id: student?.id,
      ...formData
    });
    onClose();
  };

  const renderRatingInput = (name, label, value) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => handleChange({ target: { name, value: score } })}
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
              parseInt(value) === score
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                : 'border-gray-300 hover:border-indigo-400'
            }`}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Đánh giá buổi học
        </h3>
        {lesson && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Buổi học:</span> {lesson.name}
            </p>
            {student && (
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Học viên:</span> {student.name}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {renderRatingInput('focus_score', 'Mức độ tập trung', formData.focus_score)}
        {renderRatingInput('punctuality_score', 'Đúng giờ', formData.punctuality_score)}
        {renderRatingInput('interaction_score', 'Mức độ tương tác', formData.interaction_score)}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nhận xét
        </label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Nhập nhận xét của bạn..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Lưu đánh giá
        </button>
      </div>
    </form>
  );
};

export default LessonEvaluationForm; 