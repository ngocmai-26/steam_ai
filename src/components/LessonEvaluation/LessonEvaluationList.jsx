import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LessonService } from '../../services/LessonService';
import { useSelector } from 'react-redux';
import { ButtonAction } from '../Table';
import { getThumbnailUrl } from '../../utils/imageUtils';

const LessonEvaluationList = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [showDetailId, setShowDetailId] = useState(null);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchEvaluations = async () => {
      setLoading(true);
      try {
        const data = await LessonService.getLessonEvaluations();
        setEvaluations(data || []);
      } catch (err) {
        setEvaluations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluations();
  }, []);

  // Nhóm đánh giá theo class_room_name (ưu tiên), sau đó đến class_name, className
  const grouped = evaluations.reduce((acc, evalItem) => {
    const className = evalItem.class_room_name || evalItem.class_name || evalItem.className || 'Không rõ lớp';
    if (!acc[className]) acc[className] = [];
    acc[className].push(evalItem);
    return acc;
  }, {});

  // Xem chi tiết đánh giá (không gọi API getLessonEvaluationById nữa)
  const handleShowDetail = async (evaluation) => {
    setShowDetailId(evaluation.id);
    setDetail(evaluation);
    setCriteria([]);
    try {
      const criteriaRes = await LessonService.getEvaluationCriteria();
      setCriteria(criteriaRes);
    } catch { }
  };

  // Đóng chi tiết
  const handleCloseDetail = () => {
    setShowDetailId(null);
    setDetail(null);
    setCriteria([]);
  };

  // Xóa đánh giá
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
    try {
      await LessonService.deleteLessonEvaluation(id);
      setEvaluations(evaluations.filter(e => e.id !== id));
      handleCloseDetail();
    } catch { }
  };

  if (loading) return <div className="p-6 text-center">Đang tải đánh giá...</div>;
  if (!evaluations.length) return <div className="p-6 text-center">Không có dữ liệu đánh giá nào.</div>;

  // Hiển thị chi tiết đánh giá
  if (showDetailId && detail) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Chi tiết đánh giá</h2>
        <div className="mb-4 flex items-center space-x-4">
          <img 
            src={getThumbnailUrl({ image_url: detail.student?.avatar_url }) || detail.student?.avatar_url} 
            alt="avatar" 
            className="w-12 h-12 rounded-full object-cover border"
            onError={(e) => {
              // Try alternative Google Drive URL format if current one failed
              if (e.target.src.includes('drive.google.com/thumbnail')) {
                const fileIdMatch = e.target.src.match(/id=([a-zA-Z0-9-_]+)/);
                if (fileIdMatch && fileIdMatch[1]) {
                  const fileId = fileIdMatch[1];
                  const alternativeUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                  e.target.src = alternativeUrl;
                  return;
                }
              }
              
              // If all else fails, use placeholder
              if (e.target.src !== 'https://via.placeholder.com/48x48?text=U') {
                e.target.src = 'https://via.placeholder.com/48x48?text=U';
              }
            }}
          />
          <div>
            <div className="font-semibold">{detail.student?.first_name} {detail.student?.last_name}</div>
            <div className="text-sm text-gray-500">Mã SV: {detail.student?.identification_number}</div>
          </div>
        </div>
        <div className="mb-2"><b>Lớp:</b> {detail.class_room_name || detail.class_name}</div>
        <div className="mb-2"><b>Ngày đánh giá:</b> {detail.evaluation_date || detail.date}</div>
        <div className="mb-2"><b>Nhận xét:</b> {detail.comment}</div>
        <div className="mb-4">
          <b>Kết quả tiêu chí:</b>
          <ul className="list-disc ml-6 mt-2">
            {criteria.map(c => {
              const score = detail[c.code];
              let label = '';
              if (score !== undefined && c.options) {
                const found = c.options.find(opt => String(opt.score) === String(score));
                label = found ? found.label : '';
              }
              return (
                <li key={c.code}>
                  <span className="font-medium">{c.name}:</span> {label ? `${score} - ${label}` : (score ?? 'Chưa đánh giá')}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleCloseDetail} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Đóng</button>
          <button onClick={() => navigate(`/evaluations/edit/${detail.id}`)} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Chỉnh sửa</button>
          {user?.role === 'manager' && (
            <button onClick={() => handleDelete(detail.id)} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Xóa</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {Object.entries(grouped).map(([className, evals]) => (
        <div key={className} className="mb-8">
          <h2 className="text-lg font-bold text-indigo-700 mb-2">{className}</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã SV</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học viên</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đánh giá</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tập trung</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đúng giờ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tương tác</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhận xét</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {evals.map(evaluation => (
                  <tr key={evaluation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{evaluation.student?.identification_number}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{evaluation.student?.first_name} {evaluation.student?.last_name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <img 
                        src={getThumbnailUrl({ image_url: evaluation.student?.avatar_url }) || evaluation.student?.avatar_url} 
                        alt="avatar" 
                        className="w-8 h-8 rounded-full object-cover border"
                        onError={(e) => {
                          // Try alternative Google Drive URL format if current one failed
                          if (e.target.src.includes('drive.google.com/thumbnail')) {
                            const fileIdMatch = e.target.src.match(/id=([a-zA-Z0-9-_]+)/);
                            if (fileIdMatch && fileIdMatch[1]) {
                              const fileId = fileIdMatch[1];
                              const alternativeUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                              e.target.src = alternativeUrl;
                              return;
                            }
                          }
                          
                          // If all else fails, use placeholder
                          if (e.target.src !== 'https://via.placeholder.com/32x32?text=U') {
                            e.target.src = 'https://via.placeholder.com/32x32?text=U';
                          }
                        }}
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{evaluation.evaluation_date || evaluation.date || ''}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{evaluation.focus_score ? `${evaluation.focus_score}/5` : ''}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{evaluation.punctuality_score ? `${evaluation.punctuality_score}/5` : ''}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{evaluation.interaction_score ? `${evaluation.interaction_score}/5` : ''}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{evaluation.comment || ''}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex flex-row items-center justify-center space-x-2">
                        <ButtonAction color="indigo" onClick={() => handleShowDetail(evaluation)}>
                          <span className="sm:hidden">
                            {/* icon info */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                          </span>
                          <span className="hidden sm:inline">Chi tiết</span>
                        </ButtonAction>
                        <ButtonAction color="blue" onClick={() => navigate(`/evaluations/edit/${evaluation.id}`)}>
                          <span className="sm:hidden">
                            {/* icon edit */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3h3z" /></svg>
                          </span>
                          <span className="hidden sm:inline">Sửa</span>
                        </ButtonAction>
                        {user?.role === 'manager' && (
                          <ButtonAction color="red" onClick={() => handleDelete(evaluation.id)}>
                            <span className="sm:hidden">
                              {/* icon trash */}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </span>
                            <span className="hidden sm:inline">Xóa</span>
                          </ButtonAction>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonEvaluationList; 