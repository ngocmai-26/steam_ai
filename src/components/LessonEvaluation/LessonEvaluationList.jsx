import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LessonService } from '../../services/LessonService';

const LessonEvaluationList = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      setLoading(true);
      try {
        const data = await LessonService.getLessonEvaluations();
        console.log('API /back-office/lesson-evaluations result:', data);
        setEvaluations(data || []);
      } catch (err) {
        console.error('Error fetching lesson evaluations:', err);
        setEvaluations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluations();
  }, []);

  if (loading) return <div className="p-6 text-center">Đang tải đánh giá...</div>;
  if (!evaluations.length) return <div className="p-6 text-center">Không có dữ liệu đánh giá nào.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Đánh giá buổi học</h1>
        <button
          onClick={() => navigate('/evaluations/new')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Thêm đánh giá
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lớp học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tập trung
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đúng giờ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tương tác
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhận xét
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {evaluations.map((evaluation) => (
              <tr key={evaluation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {typeof evaluation.class_name === 'object' ? JSON.stringify(evaluation.class_name) : (evaluation.class_name || evaluation.className || '')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof evaluation.lesson_date === 'object' ? JSON.stringify(evaluation.lesson_date) : (evaluation.lesson_date || evaluation.date || '')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof evaluation.focus_score === 'object'
                    ? JSON.stringify(evaluation.focus_score)
                    : evaluation.focus_score
                      ? `${evaluation.focus_score}/5`
                      : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof evaluation.punctuality_score === 'object'
                    ? JSON.stringify(evaluation.punctuality_score)
                    : evaluation.punctuality_score
                      ? `${evaluation.punctuality_score}/5`
                      : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof evaluation.interaction_score === 'object'
                    ? JSON.stringify(evaluation.interaction_score)
                    : evaluation.interaction_score
                      ? `${evaluation.interaction_score}/5`
                      : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof evaluation.comment === 'object' ? JSON.stringify(evaluation.comment) : (evaluation.comment || '')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LessonEvaluationList; 