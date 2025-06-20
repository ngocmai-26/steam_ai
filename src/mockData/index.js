// Mock data for courses
export const mockCourses = [
  {
    id: 1,
    name: 'Khóa học lập trình Python',
    description: 'Khóa học cơ bản về Python cho người mới bắt đầu',
    thumbnail: 'python-course.jpg',
    price: '1200000',
    duration: 120,
  },
  {
    id: 2,
    name: 'Khóa học JavaScript nâng cao',
    description: 'Học JavaScript chuyên sâu và các framework hiện đại',
    thumbnail: 'js-course.jpg',
    price: '1500000',
    duration: 180,
  },
];

// Mock data for classes
export const mockClasses = [
  {
    id: 1,
    name: 'Lớp Python A1',
    description: 'Lớp học buổi sáng',
    thumbnail: null,
    course_id: 1,
    course_name: 'Khóa học lập trình Python',
    teacher: 1,
    teaching_assistant: 2,
    max_students: 30,
    start_date: '2024-03-01',
    end_date: '2024-06-01',
    schedule: JSON.stringify({
      monday: '8:00-10:00',
      wednesday: '8:00-10:00',
      friday: '8:00-10:00'
    }),
  },
  {
    id: 2,
    name: 'Lớp Python A2',
    description: 'Lớp học buổi chiều',
    thumbnail: null,
    course_id: 1,
    course_name: 'Khóa học lập trình Python',
    teacher: 3,
    teaching_assistant: 4,
    max_students: 25,
    start_date: '2024-03-01',
    end_date: '2024-06-01',
    schedule: JSON.stringify({
      tuesday: '14:00-16:00',
      thursday: '14:00-16:00',
      saturday: '14:00-16:00'
    }),
  },
  {
    id: 3,
    name: 'Lớp JavaScript A1',
    description: 'Lớp học buổi tối',
    thumbnail: null,
    course_id: 2,
    course_name: 'Khóa học JavaScript nâng cao',
    teacher: 5,
    teaching_assistant: 6,
    max_students: 20,
    start_date: '2024-03-15',
    end_date: '2024-06-15',
    schedule: JSON.stringify({
      monday: '18:00-20:00',
      wednesday: '18:00-20:00',
      friday: '18:00-20:00'
    }),
  },
];

// Mock data for modules
export const mockModules = [
  {
    id: 1,
    name: 'Giới thiệu Python',
    description: 'Tổng quan về ngôn ngữ Python',
    sequence_number: 1,
    total_lessons: 5,
    class_id: 1,
    class_name: 'Lớp Python A1',
    course_id: 1,
    course_name: 'Khóa học lập trình Python',
  },
  {
    id: 2,
    name: 'Cú pháp cơ bản',
    description: 'Học về biến, điều kiện, vòng lặp',
    sequence_number: 2,
    total_lessons: 8,
    class_id: 1,
    class_name: 'Lớp Python A1',
    course_id: 1,
    course_name: 'Khóa học lập trình Python',
  },
  {
    id: 3,
    name: 'Hàm và Module',
    description: 'Tìm hiểu về function và module trong Python',
    sequence_number: 3,
    total_lessons: 6,
    class_id: 1,
    class_name: 'Lớp Python A1',
    course_id: 1,
    course_name: 'Khóa học lập trình Python',
  },
];

// Helper functions to filter data
export const getClassesByCourseId = (courseId) => {
  return mockClasses.filter(cls => cls.course_id === courseId);
};

export const getModulesByClassId = (classId) => {
  return mockModules.filter(module => module.class_id === classId);
}; 