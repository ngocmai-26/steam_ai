import React, { useState } from 'react';
import AttendanceFlow from '../components/AttendanceFlow/AttendanceFlow';
import AttendanceList from '../components/AttendanceFlow/AttendanceList';
import AttendanceStats from '../components/AttendanceFlow/AttendanceStats';

const Attendance = () => {
  const [view, setView] = useState('list'); // 'list', 'flow', hoặc 'stats'

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        
        <h1 className="text-3xl font-bold">Điểm danh lớp</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-md font-medium ${view === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Danh sách điểm danh
          </button>
          <button
            onClick={() => setView('stats')}
            className={`px-4 py-2 rounded-md font-medium ${view === 'stats'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Thống kê
          </button>
          <button
            onClick={() => setView('flow')}
            className={`px-4 py-2 rounded-md font-medium ${view === 'flow'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Điểm danh mới
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <AttendanceList />
      ) : view === 'stats' ? (
        <AttendanceStats />
      ) : (
        <AttendanceFlow onBack={() => setView('list')} />
      )}
    </div>
  );
};

export default Attendance; 