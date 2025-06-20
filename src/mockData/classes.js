export const mockClasses = [
  {
    id: '1',
    name: 'Lập trình Python cơ bản',
    description: 'Khóa học lập trình Python dành cho người mới bắt đầu',
    thumbnail: 'https://via.placeholder.com/300',
    course_id: 1,
    course_name: 'Khóa học lập trình Python',
    teacher: {
      id: 1,
      name: 'Nguyễn Văn X',
      email: 'nguyenvanx@example.com',
      phone: '0901234567'
    },
    teaching_assistant: {
      id: 2,
      name: 'Trần Thị Y',
      email: 'tranthiy@example.com',
      phone: '0901234568'
    },
    max_students: 20,
    start_date: '2024-03-01',
    end_date: '2024-06-01',
    schedule: {
      days: [
        {
          day: 'Thứ 2',
          time: '18:00 - 20:00',
          room: 'P.301',
          type: 'Lý thuyết'
        },
        {
          day: 'Thứ 4',
          time: '18:00 - 20:00',
          room: 'P.302',
          type: 'Thực hành'
        }
      ],
      total_hours: 48,
      sessions_per_week: 2,
      hours_per_session: 2
    },
    current_students: [],
    status: 'active'
  },
  {
    id: '2',
    name: 'Robotics cơ bản',
    description: 'Khóa học robotics dành cho trẻ em từ 10-15 tuổi',
    thumbnail: 'https://via.placeholder.com/300',
    course_id: 2,
    course_name: 'Khóa học Robotics',
    teacher: {
      id: 3,
      name: 'Lê Văn Z',
      email: 'levanz@example.com',
      phone: '0901234569'
    },
    teaching_assistant: {
      id: 4,
      name: 'Phạm Thị W',
      email: 'phamthiw@example.com',
      phone: '0901234570'
    },
    max_students: 15,
    start_date: '2024-03-15',
    end_date: '2024-06-15',
    schedule: {
      days: [
        {
          day: 'Thứ 3',
          time: '14:00 - 16:00',
          room: 'P.401',
          type: 'Lý thuyết'
        },
        {
          day: 'Thứ 5',
          time: '14:00 - 16:00',
          room: 'P.Lab1',
          type: 'Thực hành'
        }
      ],
      total_hours: 48,
      sessions_per_week: 2,
      hours_per_session: 2
    },
    current_students: [],
    status: 'active'
  }
]; 