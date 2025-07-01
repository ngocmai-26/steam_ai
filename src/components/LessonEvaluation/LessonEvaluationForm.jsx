import React, { useState, useEffect } from 'react';
import { LessonService } from '../../services/LessonService';

const LessonEvaluationForm = ({ classInfo, student, module, lesson, onBack, onSubmit }) => {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ comment: '' });

  useEffect(() => {
    const fetchCriteria = async () => {
      setLoading(true);
      try {
        const res = await LessonService.getEvaluationCriteria();
        setCriteria(res || []);
        console.log("criteria", res);
        // Khởi tạo formData với các trường code = ''
        const initial = { comment: '' };
        (res || []).forEach(c => { initial[c.code] = ''; });
        setFormData(initial);
      } catch {
        setCriteria([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCriteria();
  }, []);

  console.log(criteria);

  const handleScoreChange = (criteriaCode, score) => {
    setFormData(prev => ({
      ...prev,
      [criteriaCode]: score
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        class_id: classInfo?.id,
        student_id: student?.id,
        module_id: module?.id,
        lesson_id: lesson?.id,
        ...formData
      });
    } else {
      // fallback log
      console.log('Submitting evaluation:', {
        class_id: classInfo?.id,
        student_id: student?.id,
        module_id: module?.id,
        lesson_id: lesson?.id,
        ...formData
      });
    }
  };

  const renderCriterion = (criterion) => (
    <div key={criterion.code} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{criterion.name}</h3>
      <div className="space-y-2">
        {criterion.options?.map((option) => (
          <label
            key={option.score}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData[criterion.code] === option.score
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={criterion.code}
              value={option.score}
              checked={formData[criterion.code] === option.score}
              onChange={() => handleScoreChange(criterion.code, option.score)}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <div className="ml-3">
              <span className="text-sm font-medium text-gray-900">
                {option.score} - {option.label}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  if (loading) return <div className="p-6 text-center">Đang tải tiêu chí đánh giá...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Đánh giá buổi học
      </h2>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        {classInfo && (
          <p className="text-gray-600">
            <span className="font-medium">Lớp:</span> {classInfo.name}
          </p>
        )}
        {student && (
          <p className="text-gray-600">
            <span className="font-medium">Học viên:</span> {student.name}
          </p>
        )}
        {module && (
          <p className="text-gray-600">
            <span className="font-medium">Học phần:</span> {module.name}
          </p>
        )}
        {lesson && (
          <p className="text-gray-600">
            <span className="font-medium">Buổi học:</span> {lesson.name}
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {criteria.length > 0 ? criteria.map(renderCriterion) : <div className="text-gray-500">Không có tiêu chí đánh giá.</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhận xét
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={e => handleScoreChange('comment', e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Nhập nhận xét của bạn..."
          />
        </div>
        <div className="flex justify-end space-x-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Quay lại
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Lưu đánh giá
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonEvaluationForm; 