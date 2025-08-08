import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, to }) => (
  <Link to={to} className="block">
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
      <div className={`rounded-full p-4 ${color} mr-4`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </Link>
);

const Dashboard = () => {
  const stats = [
    {
      title: 'Tổng số học viên',
      value: '150',
      icon: '👥',
      color: 'bg-blue-100',
      to: '/students'
    },
    {
      title: 'Khóa học đang mở',
      value: '12',
      icon: '📚',
      color: 'bg-green-100',
      to: '/courses'
    },
    {
      title: 'Lớp học hoạt động',
      value: '8',
      icon: '🏫',
      color: 'bg-purple-100',
      to: '/classes'
    },
    {
      title: 'Đánh giá mới',
      value: '25',
      icon: '📝',
      color: 'bg-yellow-100',
      to: '/evaluations'
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Hoạt động gần đây</h2>
            <Link 
              to="/students" 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <Link to="/students" key={index} className="block">
                <div className="flex items-center py-2 border-b hover:bg-gray-50 transition-colors">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <span>📅</span>
                  </div>
                  <div>
                    <p className="font-medium">Học viên mới đăng ký</p>
                    <p className="text-sm text-gray-500">2 giờ trước</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Lớp học sắp tới</h2>
            <Link 
              to="/classes" 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <Link to="/classes" key={index} className="block">
                <div className="flex items-center py-2 border-b hover:bg-gray-50 transition-colors">
                  <div className="bg-green-100 rounded-full p-2 mr-4">
                    <span>📚</span>
                  </div>
                  <div>
                    <p className="font-medium">Lớp Python cơ bản</p>
                    <p className="text-sm text-gray-500">10:00 AM - 11:30 AM</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 