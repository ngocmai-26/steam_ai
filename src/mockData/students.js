export const mockStudents = [
  {
    id: '1',
    identification_number: 'SV001',
    first_name: 'Nguyễn',
    last_name: 'Văn A',
    date_of_birth: '2010-01-01',
    gender: 'male',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone_number: '0901234567',
    email: 'nguyenvana@example.com',
    parent_name: 'Nguyễn Văn B',
    parent_phone: '0907654321',
    parent_email: 'nguyenvanb@example.com',
    avatar_url: 'https://via.placeholder.com/150',
    is_active: true,
    registrations: [
      {
        class_id: 1,
        course_id: 1,
        registration_date: '2024-01-01',
        status: 'active'
      }
    ]
  },
  {
    id: '2',
    identification_number: 'SV002',
    first_name: 'Trần',
    last_name: 'Thị B',
    date_of_birth: '2011-02-02',
    gender: 'female',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    phone_number: '0901234568',
    email: 'tranthib@example.com',
    parent_name: 'Trần Văn C',
    parent_phone: '0907654322',
    parent_email: 'tranvanc@example.com',
    avatar_url: 'https://via.placeholder.com/150',
    is_active: true,
    registrations: [
      {
        class_id: 2,
        course_id: 1,
        registration_date: '2024-01-02',
        status: 'active'
      }
    ]
  },
  {
    id: '3',
    identification_number: 'SV003',
    first_name: 'Lê',
    last_name: 'Văn C',
    date_of_birth: '2000-03-03',
    gender: 'male',
    address: '789 Đường DEF, Quận 3, TP.HCM',
    phone_number: '0901234569',
    email: 'vanc@example.com',
    parent_name: 'Lê Văn Z',
    parent_phone: '0907654323',
    parent_email: 'vanz@example.com',
    note: '',
    avatar_url: 'https://i.pravatar.cc/150?img=3',
    is_active: false,
    registrations: []
  }
]; 