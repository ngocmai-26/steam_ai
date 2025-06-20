import React, { useState } from 'react';

const EvaluationForm = ({ classInfo, student, module, lesson, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    focus_score: '',
    punctuality_score: '',
    interaction_score: '',
    comment: ''
  });

  const criteria = [
    {
      id: 1,
      name: "Mức độ tập trung",
      code: "focus_score",
      options: [
        { score: 1, label: "Không tập trung: Thường xuyên mất tập trung, sao nhãng trong giờ học" },
        { score: 2, label: "Ít tập trung: Thỉnh thoảng bị phân tán, cần nhắc nhở" },
        { score: 3, label: "Tập trung khá: Duy trì được sự tập trung trong phần lớn thời gian" },
        { score: 4, label: "Tập trung tốt: Rất chú ý, ít khi bị sao nhãng" },
        { score: 5, label: "Hoàn toàn tập trung: Luôn giữ sự tập trung cao độ, chủ động tiếp thu" }
      ]
    },
    {
      id: 2,
      name: "Đi muộn/Trễ",
      code: "punctuality_score",
      options: [
        { score: 1, label: "Thường xuyên đi muộn/về sớm: Rất ít khi đúng giờ" },
        { score: 2, label: "Hay đi muộn/về sớm: Thường xuyên đến muộn hoặc về sớm" },
        { score: 3, label: "Thỉnh thoảng đi muộn/về sớm: Có một vài lần không đúng giờ" },
        { score: 4, label: "Hiếm khi đi muộn/về sớm: Gần như luôn đúng giờ" },
        { score: 5, label: "Luôn đúng giờ: Chưa bao giờ đi muộn hay về sớm" }
      ]
    },
    {
      id: 3,
      name: "Mức độ tương tác",
      code: "interaction_score",
      options: [
        { score: 1, label: "Thụ động: Không đặt câu hỏi, không tham gia thảo luận" },
        { score: 2, label: "Ít tương tác: Hiếm khi tham gia thảo luận, ít phát biểu" },
        { score: 3, label: "Tương tác vừa phải: Thỉnh thoảng tham gia thảo luận và đặt câu hỏi" },
        { score: 4, label: "Tương tác tốt: Thường xuyên tham gia thảo luận, đặt nhiều câu hỏi" },
        { score: 5, label: "Tương tác rất tốt: Chủ động tham gia thảo luận, đặt câu hỏi sâu sắc" }
      ]
    }
  ];

  const handleScoreChange = (criteriaCode, score) => {
    setFormData(prev => ({
      ...prev,
      [criteriaCode]: score
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderCriterion = (criterion) => (
    <div key={criterion.id} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{criterion.name}</h3>
      <div className="space-y-2">
        {criterion.options.map((option) => (
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

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Đánh giá buổi học
      </h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          <span className="font-medium">Lớp:</span> {classInfo?.name}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Học viên:</span> {student?.name}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Học phần:</span> {module?.name}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Buổi học:</span> {lesson?.name}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {criteria.map(renderCriterion)}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhận xét
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => handleScoreChange('comment', e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Nhập nhận xét của bạn..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Quay lại
          </button>
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

export default EvaluationForm; 