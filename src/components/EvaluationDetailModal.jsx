import React from 'react';

const EvaluationDetailModal = ({ isOpen, onClose, evaluation }) => {
    if (!isOpen || !evaluation) return null;

    const { semantic_scores } = evaluation;

    const renderScoreItem = (key, scoreData) => {
        if (!scoreData) return null;

        // Xử lý trường hợp scoreData là string (như old_knowledge_score)
        if (typeof scoreData === 'string') {
            return (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 capitalize">
                        {key.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-gray-700">{scoreData}</p>
                </div>
            );
        }

        // Xử lý trường hợp scoreData là object
        const { name, label, value, description } = scoreData;
        
        return (
            <div key={key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{name}</h4>
                    {value !== undefined && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {value}/5
                        </span>
                    )}
                </div>
                {label && (
                    <p className="text-gray-700 font-medium">{label}</p>
                )}
                {description && (
                    <p className="text-gray-600 text-sm mt-1">{description}</p>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Chi tiết đánh giá học viên
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
                    {/* Thông tin cơ bản */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đánh giá</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-blue-600 font-medium">học viên</p>
                                <p className="text-blue-900 font-semibold">
                                    {evaluation.student?.first_name} {evaluation.student?.last_name}
                                </p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-green-600 font-medium">Buổi học</p>
                                <p className="text-green-900 font-semibold">
                                    {evaluation.module_name || 'N/A'}
                                </p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm text-purple-600 font-medium">Ngày đánh giá</p>
                                <p className="text-purple-900 font-semibold">
                                    {new Date(evaluation.created_at).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4">
                                <p className="text-sm text-orange-600 font-medium">Điểm tổng</p>
                                <p className="text-orange-900 font-semibold text-lg">
                                    {Object.values(semantic_scores || {})
                                        .filter(score => typeof score === 'object' && score.value !== undefined)
                                        .reduce((sum, score) => sum + (score.value || 0), 0)}/50
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chi tiết semantic_scores */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết đánh giá</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {semantic_scores && Object.entries(semantic_scores).map(([key, scoreData]) => 
                                renderScoreItem(key, scoreData)
                            )}
                        </div>
                    </div>

                    {/* Raw data (for debugging) */}
                    <div className="mt-6">
                        <details className="bg-gray-100 rounded-lg p-4">
                            <summary className="cursor-pointer font-medium text-gray-700">
                                Xem dữ liệu thô (Debug)
                            </summary>
                            <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-40">
                                {JSON.stringify(evaluation, null, 2)}
                            </pre>
                        </details>
                    </div>
                </div>

                {/* Footer */}
               
            </div>
        </div>
    );
};

export default EvaluationDetailModal;
