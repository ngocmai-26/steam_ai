# Authentication & Auto Logout System

## Tổng quan

Hệ thống tự động logout khi nhận được lỗi authentication từ API, đặc biệt là lỗi "Verify token failed!".

## Cách hoạt động

### 1. Axios Interceptor (src/axiosConfig.js)

Axios interceptor được cấu hình để tự động xử lý các lỗi authentication:

```javascript
// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Kiểm tra lỗi authentication (401 hoặc "Verify token failed!")
    if (isAuthError(error)) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);
```

### 2. Auth Utilities (src/utils/authUtils.js)

Các utility functions để xử lý logout một cách nhất quán:

- `clearAuthData()`: Xóa tất cả thông tin authentication khỏi localStorage
- `handleLogout()`: Thực hiện logout và redirect về trang login
- `isTokenVerificationError(error)`: Kiểm tra lỗi "Verify token failed!"
- `isAuthError(error)`: Kiểm tra các lỗi authentication (401 hoặc "Verify token failed!")

### 3. Các trường hợp được xử lý

Hệ thống sẽ tự động logout khi:

1. **HTTP Status 401**: Unauthorized
2. **Response data**: `{"detail":"Verify token failed!"}`

### 4. Quy trình logout

Khi phát hiện lỗi authentication:

1. Xóa tất cả thông tin auth khỏi localStorage:
   - `token`
   - `auth_token`
   - `refresh`
   - `info`
   - `userInfo`

2. Redirect người dùng về trang `/login`

3. Hiển thị thông báo logout (nếu có)

## Sử dụng

### Trong Components

```javascript
import { handleLogout } from '../utils/authUtils';

// Manual logout
const handleManualLogout = () => {
  handleLogout();
};
```

### Trong Services

Các service sử dụng axios instance đã được cấu hình sẽ tự động xử lý lỗi authentication:

```javascript
import axios from '../axiosConfig';

// API call sẽ tự động logout nếu có lỗi auth
const response = await axios.get('/api/data');
```

### Trong Thunks

```javascript
import { clearAuthData } from '../utils/authUtils';

export const logoutThunk = () => (dispatch) => {
  clearAuthData();
  dispatch(logout());
};
```

## Lưu ý

- Tất cả API calls sử dụng axios instance sẽ tự động xử lý lỗi authentication
- Không cần thêm logic xử lý lỗi auth trong từng service riêng lẻ
- Hệ thống đảm bảo tính nhất quán trong việc xử lý logout
- User sẽ được redirect về trang login ngay lập tức khi token hết hạn hoặc không hợp lệ 