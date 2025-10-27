import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { changePassword, setCurrentUserInfo } from '../slices/userSlice';
import UserService from '../services/UserService';

const Profile = () => {
    const dispatch = useDispatch();
    const currentUserInfo = useSelector((state) => state.users.currentUserInfo);
    const user = useSelector((state) => state.auth.user);
    const displayUser = currentUserInfo || user;

    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [profileData, setProfileData] = useState({
        name: displayUser?.name || '',
        phone: displayUser?.phone || '',
        birth_date: displayUser?.birth_date || '',
        gender: displayUser?.gender || 'male'
    });
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error('Mật khẩu mới không khớp!');
            return;
        }

        if (passwordData.new_password.length < 8) {
            toast.error('Mật khẩu mới phải có ít nhất 8 ký tự!');
            return;
        }

        setLoading(true);
        try {
            await dispatch(changePassword({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password
            })).unwrap();

            toast.success('Thay đổi mật khẩu thành công!');
            setShowChangePassword(false);
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
        } catch (error) {
            toast.error(error || 'Thay đổi mật khẩu thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const formatRole = (role) => {
        const roleMap = {
            'root': 'Quản trị hệ thống',
            'admin': 'Quản trị viên',
            'manager': 'Quản lý',
            'teacher': 'Giáo viên'
        };
        return roleMap[role] || role;
    };

    const formatStatus = (status) => {
        const statusMap = {
            'activated': 'Đã kích hoạt',
            'blocked': 'Đã khóa',
            'unverified': 'Chưa xác thực'
        };
        return statusMap[status] || status;
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        try {
            const result = await UserService.updateMyProfile(profileData);
            dispatch(setCurrentUserInfo(result));
            toast.success('Cập nhật hồ sơ thành công!');
            setShowEditProfile(false);
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Cập nhật hồ sơ thất bại!');
        } finally {
            setProfileLoading(false);
        }
    };

    return (
        <div className="p-2 md:p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-3 md:px-6 py-3 md:py-4 rounded-t-lg">
                    <h1 className="text-xl md:text-2xl font-bold text-white">Hồ sơ cá nhân</h1>
                </div>

                <div className="p-3 md:p-6">
                    {/* Header with Edit Button */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h3>
                        {!showEditProfile && (
                            <button
                                onClick={() => setShowEditProfile(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Chỉnh sửa
                            </button>
                        )}
                    </div>

                    {!showEditProfile ? (
                        /* View Mode */
                        <div className="flex flex-col gap-4 mb-6 md:grid md:grid-cols-3 md:gap-6 md:mb-8">
                            {/* Avatar */}
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                                    {displayUser?.name ? displayUser.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <h2 className="text-lg md:text-xl font-semibold text-gray-900">{displayUser?.name}</h2>
                                <p className="text-gray-600 text-sm md:text-base">{formatRole(displayUser?.role)}</p>
                            </div>

                            {/* Basic Info */}
                            <div className="md:col-span-2">
                                <div className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-4">
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-1">Họ và tên</label>
                                        <p className="text-gray-900 text-base">{displayUser?.name || 'Chưa cập nhật'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-1">Email</label>
                                        <p className="text-gray-900 text-base">{displayUser?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-1">Số điện thoại</label>
                                        <p className="text-gray-900 text-base">{displayUser?.phone || 'Chưa cập nhật'}</p>
                                    </div>
                                    {displayUser?.staff_id && (
                                        <div>
                                            <label className="block text-base font-medium text-gray-700 mb-1">Mã nhân viên</label>
                                            <p className="text-gray-900 text-base font-semibold">{displayUser.staff_id}</p>
                                        </div>
                                    )}
                                    {displayUser?.birth_date && (
                                        <div>
                                            <label className="block text-base font-medium text-gray-700 mb-1">Ngày sinh</label>
                                            <p className="text-gray-900 text-base">{new Date(displayUser.birth_date).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    )}
                                    {displayUser?.gender && (
                                        <div>
                                            <label className="block text-base font-medium text-gray-700 mb-1">Giới tính</label>
                                            <p className="text-gray-900 text-base">{displayUser.gender === 'male' ? 'Nam' : displayUser.gender === 'female' ? 'Nữ' : displayUser.gender}</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-1">Vai trò</label>
                                        <p className="text-gray-900 text-base">{formatRole(displayUser?.role)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-1">Trạng thái</label>
                                        <p className="text-gray-900 text-base">{formatStatus(displayUser?.status)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Edit Mode */
                        <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6">
                            <h4 className="text-md font-medium text-gray-900 mb-4">Chỉnh sửa thông tin</h4>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-1">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-1">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-1">
                                            Ngày sinh
                                        </label>
                                        <input
                                            type="date"
                                            name="birth_date"
                                            value={profileData.birth_date}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-1">
                                            Giới tính
                                        </label>
                                        <select
                                            name="gender"
                                            value={profileData.gender}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                        >
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-end md:space-x-3 gap-2 md:gap-0 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditProfile(false);
                                            setProfileData({
                                                name: displayUser?.name || '',
                                                phone: displayUser?.phone || '',
                                                birth_date: displayUser?.birth_date || '',
                                                gender: displayUser?.gender || 'male'
                                            });
                                        }}
                                        className="w-full md:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={profileLoading}
                                        className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {profileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Change Password Section */}
                    <div className="border-t pt-4 md:pt-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 md:mb-4 gap-2 md:gap-0">
                            <h3 className="text-lg font-medium text-gray-900">Bảo mật</h3>
                            <button
                                onClick={() => setShowChangePassword(!showChangePassword)}
                                className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {showChangePassword ? 'Hủy' : 'Thay đổi mật khẩu'}
                            </button>
                        </div>

                        {showChangePassword && (
                            <div className="bg-gray-50 rounded-lg p-3 md:p-6">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Thay đổi mật khẩu</h4>
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-1">
                                            Mật khẩu hiện tại <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="current_password"
                                            value={passwordData.current_password}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-1">
                                            Mật khẩu mới <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="new_password"
                                            value={passwordData.new_password}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength={8}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                            placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-1">
                                            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            value={passwordData.confirm_password}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </div>

                                    <div className="flex flex-col md:flex-row md:justify-end md:space-x-3 gap-2 md:gap-0">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowChangePassword(false);
                                                setPasswordData({
                                                    current_password: '',
                                                    new_password: '',
                                                    confirm_password: ''
                                                });
                                            }}
                                            className="w-full md:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                        >
                                            {loading ? 'Đang xử lý...' : 'Thay đổi mật khẩu'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 