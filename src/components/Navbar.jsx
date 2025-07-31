import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../thunks/AuthThunks';
import { selectUser } from '../slices/authSlice';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const currentUserInfo = useSelector((state) => state.users.currentUserInfo);

  // Sử dụng currentUserInfo nếu có, nếu không thì dùng user từ auth
  const displayUser = currentUserInfo || user;

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const menuItems = [

    {
      to: '/students',
      label: 'Quản lý học viên',
      icon: '👥'
    },
    {
      to: '/courses',
      label: 'Quản lý khóa học',
      icon: '📚'
    },
    {
      to: '/classes',
      label: 'Quản lý lớp học',
      icon: '🏫'
    },
    {
      to: '/modules',
      label: 'Quản lý học phần',
      icon: '🧩'
    },
    {
      to: '/lessons',
      label: 'Quản lý buổi học',
      icon: '📅'
    },
    {
      to: '/evaluations',
      label: 'Đánh giá học viên',
      icon: '⭐'
    },
    {
      to: '/attendance',
      label: 'Điểm danh',
      icon: '✅'
    },
    {
      to: '/calendar',
      label: 'Lịch học',
      icon: '📆'
    },
    {
      to: '/accounts',
      label: 'Quản lý tài khoản',
      icon: '🛡️',
      adminOnly: true
    }
  ];

  // Lọc menu theo role
  const isAdmin = user && (user.role?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'root');
  let filteredMenuItems = menuItems;
  if (isAdmin) {
    filteredMenuItems = menuItems.filter(item => item.adminOnly);
  } else {
    filteredMenuItems = menuItems.filter(item => !item.adminOnly);
  }

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-indigo-600">
              STEAM AI
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2 xl:space-x-4">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-2 xl:px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${location.pathname === item.to
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <span className="mr-1 xl:mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Tablet Menu */}
          <div className="hidden md:flex lg:hidden md:items-center md:space-x-1">
            {filteredMenuItems.slice(0, 4).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-2 py-2 rounded-md text-sm font-medium whitespace-nowrap ${location.pathname === item.to
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <span className="mr-1">📋</span>
              Thêm
            </button>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4 user-menu">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md p-2"
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                  {displayUser?.name ? displayUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden lg:inline">{displayUser?.name || 'User'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{displayUser?.name}</div>
                    <div className="text-gray-500 max-w-[180px] truncate">{displayUser?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    👤 Xem hồ sơ
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.to
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-2">
                <div className="px-3 py-2 text-base font-medium text-gray-700">
                  {displayUser?.name || 'User'}
                </div>
                <div className="px-3 py-1 text-sm text-gray-500">
                  {displayUser?.email}
                </div>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 mb-2"
                >
                  👤 Xem hồ sơ
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  🚪 Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 