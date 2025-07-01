# Class API Documentation

## Tổng quan
API Classes hỗ trợ quản lý các lớp học trong hệ thống STEAM. Tất cả các request đều sử dụng JSON format.

## Base URL
```
https://bdu-steam.onrender.com/steam/apis/back-office/classes
```

## Authentication
Tất cả các request cần có Bearer token trong header:
```
Authorization: Bearer <your_token>
Content-Type: application/json
```

## Endpoints

### 1. Lấy danh sách lớp học

**GET** `/classes`

**Query Parameters:**
- `course_id` (optional): Lọc theo khóa học
- `status` (optional): Lọc theo trạng thái (active, inactive, completed)
- `page` (optional): Số trang
- `limit` (optional): Số lượng item mỗi trang
- `search` (optional): Tìm kiếm theo tên

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Lập trình Python cơ bản",
      "description": "Khóa học lập trình Python dành cho người mới bắt đầu",
      "course_id": 1,
      "course_name": "Khóa học lập trình Python",
      "teacher": {
        "id": 1,
        "name": "Nguyễn Văn X",
        "email": "nguyenvanx@example.com"
      },
      "teaching_assistant": {
        "id": 2,
        "name": "Trần Thị Y",
        "email": "tranthiy@example.com"
      },
      "max_students": 20,
      "current_students": 15,
      "start_date": "2024-03-01",
      "end_date": "2024-06-01",
      "schedule": {
        "monday": "18:00-20:00",
        "wednesday": "18:00-20:00"
      },
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "total_pages": 3
  }
}
```

### 2. Lấy chi tiết lớp học

**GET** `/classes/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Lập trình Python cơ bản",
    "description": "Khóa học lập trình Python dành cho người mới bắt đầu",
    "course_id": 1,
    "course_name": "Khóa học lập trình Python",
    "teacher": {
      "id": 1,
      "name": "Nguyễn Văn X",
      "email": "nguyenvanx@example.com",
      "phone": "0901234567"
    },
    "teaching_assistant": {
      "id": 2,
      "name": "Trần Thị Y",
      "email": "tranthiy@example.com",
      "phone": "0901234568"
    },
    "max_students": 20,
    "current_students": 15,
    "start_date": "2024-03-01",
    "end_date": "2024-06-01",
    "schedule": {
      "monday": "18:00-20:00",
      "wednesday": "18:00-20:00"
    },
    "status": "active",
    "students": [
      {
        "id": 1,
        "name": "Học viên A",
        "email": "hocviena@example.com",
        "enrolled_at": "2024-01-10T09:00:00Z"
      }
    ],
    "modules": [
      {
        "id": 1,
        "name": "Module 1: Giới thiệu Python",
        "description": "Tổng quan về ngôn ngữ Python"
      }
    ],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Tạo lớp học mới

**POST** `/classes`

**Request Body:**
```json
{
  "name": "Lập trình Python cơ bản",
  "description": "Khóa học lập trình Python dành cho người mới bắt đầu",
  "course_id": 1,
  "teacher_id": 1,
  "teaching_assistant_id": 2,
  "max_students": 20,
  "start_date": "2024-03-01",
  "end_date": "2024-06-01",
  "schedule": {
    "monday": "18:00-20:00",
    "wednesday": "18:00-20:00"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo lớp học thành công!",
  "data": {
    "id": 1,
    "name": "Lập trình Python cơ bản",
    "description": "Khóa học lập trình Python dành cho người mới bắt đầu",
    "course_id": 1,
    "teacher_id": 1,
    "teaching_assistant_id": 2,
    "max_students": 20,
    "start_date": "2024-03-01",
    "end_date": "2024-06-01",
    "schedule": {
      "monday": "18:00-20:00",
      "wednesday": "18:00-20:00"
    },
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Cập nhật lớp học

**PUT** `/classes/{id}`

**Request Body:** (Tương tự như tạo mới, nhưng chỉ gửi các trường cần cập nhật)

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật lớp học thành công!",
  "data": {
    "id": 1,
    "name": "Lập trình Python cơ bản - Cập nhật",
    "description": "Khóa học lập trình Python dành cho người mới bắt đầu",
    "course_id": 1,
    "teacher_id": 1,
    "teaching_assistant_id": 2,
    "max_students": 25,
    "start_date": "2024-03-01",
    "end_date": "2024-06-01",
    "schedule": {
      "monday": "18:00-20:00",
      "wednesday": "18:00-20:00"
    },
    "status": "active",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

### 5. Xóa lớp học

**DELETE** `/classes/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Xóa lớp học thành công!"
}
```

### 6. Cập nhật trạng thái lớp học

**PATCH** `/classes/{id}`

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái thành công!",
  "data": {
    "id": 1,
    "status": "inactive",
    "updated_at": "2024-01-15T11:30:00Z"
  }
}
```

### 7. Lấy thống kê lớp học

**GET** `/classes/{id}/statistics`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_students": 15,
    "attendance_rate": 85.5,
    "completion_rate": 92.3,
    "average_score": 8.5,
    "modules_completed": 8,
    "total_modules": 10,
    "upcoming_sessions": 5,
    "completed_sessions": 12
  }
}
```

### 8. Bulk Operations

**PATCH** `/classes/bulk`

**Request Body:**
```json
{
  "class_ids": [1, 2, 3],
  "status": "active"
}
```

**DELETE** `/classes/bulk`

**Request Body:**
```json
{
  "class_ids": [1, 2, 3]
}
```

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": ["Tên lớp học là bắt buộc"],
    "course_id": ["Khóa học là bắt buộc"],
    "start_date": ["Ngày bắt đầu không hợp lệ"]
  }
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Lớp học không tồn tại",
  "error_code": "CLASS_NOT_FOUND"
}
```

### Server Error
```json
{
  "success": false,
  "message": "Có lỗi xảy ra trong quá trình xử lý",
  "error_code": "INTERNAL_SERVER_ERROR"
}
```

## Data Validation Rules

### Class Data
- `name`: Bắt buộc, tối đa 255 ký tự
- `description`: Tùy chọn, tối đa 1000 ký tự
- `course_id`: Bắt buộc, phải tồn tại trong database
- `teacher_id`: Tùy chọn, phải tồn tại trong database
- `teaching_assistant_id`: Tùy chọn, phải tồn tại trong database
- `max_students`: Tùy chọn, phải là số nguyên dương
- `start_date`: Bắt buộc, định dạng YYYY-MM-DD
- `end_date`: Bắt buộc, phải sau start_date
- `schedule`: Tùy chọn, phải là JSON hợp lệ

### Schedule Format
```json
{
  "monday": "18:00-20:00",
  "wednesday": "18:00-20:00",
  "friday": "18:00-20:00"
}
```

## Status Values
- `active`: Đang hoạt động
- `inactive`: Tạm dừng
- `completed`: Đã hoàn thành
- `cancelled`: Đã hủy

## Usage Examples

### JavaScript/React
```javascript
import ClassService from '../services/ClassService';

// Lấy danh sách lớp học
const classes = await ClassService.getClasses();

// Tạo lớp học mới
const newClass = await ClassService.createClass({
  name: "Lập trình Python cơ bản",
  course_id: 1,
  start_date: "2024-03-01",
  end_date: "2024-06-01"
});

// Cập nhật lớp học
const updatedClass = await ClassService.updateClass(1, {
  max_students: 25
});

// Xóa lớp học
await ClassService.deleteClass(1);
```

### cURL Examples
```bash
# Lấy danh sách lớp học
curl -X GET "https://bdu-steam.onrender.com/steam/apis/back-office/classes" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Tạo lớp học mới
curl -X POST "https://bdu-steam.onrender.com/steam/apis/back-office/classes" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lập trình Python cơ bản",
    "course_id": 1,
    "start_date": "2024-03-01",
    "end_date": "2024-06-01"
  }'
``` 