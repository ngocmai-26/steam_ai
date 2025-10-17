import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../thunks/AuthThunks';
import { selectUser } from '../slices/authSlice';
import { HiUser, HiLogout } from 'react-icons/hi';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
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
      if (openDropdown && !event.target.closest('.dropdown-menu')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, openDropdown]);

  // Nhóm menu items theo chức năng
  const menuGroups = [
    {
      label: 'Quản lý học tập',
      icon: '📚',
      items: [
        {
          to: '/courses',
          label: 'Quản lý khóa học',
          icon: '📚',
          managerOnly: true
        },
        {
          to: '/classes',
          label: 'Quản lý lớp học',
          icon: '🏫'
        },
        {
          to: '/modules',
          label: 'Quản lý học phần',
          icon: '🧩',
          hideForTeacher: true
        },
        {
          to: '/lessons',
          label: 'Quản lý buổi học',
          icon: '📅',
          hideForTeacher: true
        }
      ]
    },
    {
      label: 'Quản lý học viên',
      icon: '👥',
      items: [
        {
          to: '/student-registrations',
          label: 'Duyệt đăng ký',
          icon: '✅',
          managerOnly: true
        },
        {
          to: '/students',
          label: 'Quản lý học viên',
          icon: '👥',
          hideForTeacher: true
        }
      ]
    },
    {
      label: 'Hệ thống',
      icon: '⚙️',
      items: [
        {
          to: '/accounts',
          label: 'Quản lý tài khoản',
          icon: '🛡️',
          adminOnly: true
        },
        {
          to: '/news',
          label: 'Quản lý tin tức',
          icon: '📰',
          hideForTeacher: true
        },
        {
          to: '/facilities',
          label: 'Quản lý cơ sở vật chất',
          icon: '🏢',
          managerOnly: true
        }
      ]
    }
  ];

  // Menu items đơn lẻ (không nhóm)
  const singleMenuItems = [
    {
      to: '/calendar',
      label: 'Lịch học',
      icon: '📆',
      hideForManager: true
    }
  ];

  // Lọc menu theo role
  const isAdmin = user && (user.role?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'root');
  const isManager = user && user.role?.toLowerCase() === 'manager';
  const isTeacher = user && user.role?.toLowerCase() === 'teacher';

  // Hàm lọc menu items
  const filterMenuItems = (items) => {
    let filtered = items;
    
    if (isAdmin) {
      filtered = filtered.filter(item => item.adminOnly);
    } else {
      filtered = filtered.filter(item => !item.adminOnly);
    }

    if (isManager) {
      filtered = filtered.filter(item => !item.hideForManager);
    }

    if (!isManager) {
      filtered = filtered.filter(item => !item.managerOnly);
    }

    if (isTeacher) {
      filtered = filtered.filter(item => !item.hideForTeacher);
    }

    return filtered;
  };

  // Lọc menu groups và single menu items
  const filteredMenuGroups = menuGroups.map(group => ({
    ...group,
    items: filterMenuItems(group.items)
  })).filter(group => group.items.length > 0);

  const filteredSingleMenuItems = filterMenuItems(singleMenuItems);

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
            {/* Menu Groups với Dropdown */}
            {filteredMenuGroups.map((group) => (
              <div key={group.label} className="relative dropdown-menu">
                <button
                  onClick={() => setOpenDropdown(openDropdown === group.label ? null : group.label)}
                  className={`px-2 xl:px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex items-center ${openDropdown === group.label
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <span className="mr-1 xl:mr-2">{group.icon}</span>
                  {group.label}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === group.label && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-50 border">
                    {group.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpenDropdown(null)}
                        className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${location.pathname === item.to
                          ? 'bg-indigo-50 text-indigo-700'
                          : ''
                          }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Single Menu Items */}
            {filteredSingleMenuItems.map((item) => (
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
            {/* Hiển thị menu groups và single items */}
            {filteredMenuGroups.slice(0, 2).map((group) => (
              <div key={group.label} className="relative dropdown-menu">
                <button
                  onClick={() => setOpenDropdown(openDropdown === group.label ? null : group.label)}
                  className={`px-2 py-2 rounded-md text-sm font-medium whitespace-nowrap flex items-center ${openDropdown === group.label
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <span className="mr-1">{group.icon}</span>
                  {group.label}
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === group.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    {group.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpenDropdown(null)}
                        className={`flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 ${location.pathname === item.to
                          ? 'bg-indigo-50 text-indigo-700'
                          : ''
                          }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Single menu items */}
            {filteredSingleMenuItems.map((item) => (
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
                    className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <HiUser className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="font-medium">Xem hồ sơ</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <HiLogout className="w-4 h-4 mr-3 text-red-500" />
                    <span className="font-medium">Đăng xuất</span>
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
            {/* Menu Groups */}
            {filteredMenuGroups.map((group) => (
              <div key={group.label}>
                <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {group.icon} {group.label}
                </div>
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block px-6 py-2 rounded-md text-base font-medium ${location.pathname === item.to
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}

            {/* Single Menu Items */}
            {filteredSingleMenuItems.map((item) => (
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
            
            {/* User Section */}
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
                  className="flex items-center w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 mb-3 transition-colors duration-200"
                >
                  <HiUser className="w-5 h-5 mr-3 text-gray-500" />
                  <span>Xem hồ sơ</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <HiLogout className="w-5 h-5 mr-3" />
                  <span>Đăng xuất</span>
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