import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaTachometerAlt, FaUserGraduate, FaBook, FaChalkboardTeacher, FaClipboardCheck, FaUserCheck, FaUsersCog, FaBookOpen } from 'react-icons/fa';

const MainLayout = () => {
  const navigation = [
    { name: 'Bảng điều khiển', href: '/dashboard', icon: FaTachometerAlt, roles: ['manager'] },
    { name: 'Quản lý học viên', href: '/students', icon: FaUserGraduate, roles: ['manager'] },
    { name: 'Quản lý khóa học', href: '/courses', icon: FaBook, roles: ['manager'] },
    { name: 'Quản lý lớp học', href: '/classes', icon: FaChalkboardTeacher, roles: ['manager'] },
    { name: 'Quản lý học phần', href: '/modules', icon: FaBookOpen, roles: ['manager'] },
    { name: 'Đánh giá', href: '/evaluations', icon: FaClipboardCheck, roles: ['manager', 'teacher'] },
    { name: 'Điểm danh', href: '/attendance', icon: FaUserCheck, roles: ['manager', 'teacher'] },
    { name: 'Quản lý tài khoản', href: '/accounts', icon: FaUsersCog, roles: ['manager'] },
    { name: 'Tạo tài khoản', href: '/create-user', icon: FaUsersCog, roles: ['root'] },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 md:py-8">
        <div className="w-full max-w-[1200px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 