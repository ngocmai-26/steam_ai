export const mockCourses = [
  {
    id: 1,
    name: 'Khóa học React Nâng cao',
    description: 'Học React từ cơ bản đến nâng cao với các kỹ thuật tối ưu hiệu năng',
    status: 'active',
    thumbnail: 'https://picsum.photos/800/400',
    classes: [
      {
        id: 1,
        course_id: 1,
        name: 'Lớp React A1',
        description: 'Lớp học buổi tối cho người đi làm',
        status: 'active',
        instructor: 'Nguyễn Văn A',
        schedule: 'Thứ 2, 4, 6 - 18:30-21:30',
        startDate: '2024-03-01',
        endDate: '2024-06-01',
        duration: 180,
        studentCount: 15,
        maxStudents: 20,
        students: [
          {
            id: 1,
            name: 'Trần Văn B',
            email: 'tranvanb@example.com',
            phone: '0123456789',
            status: 'active',
            progress: 60
          },
          {
            id: 2,
            name: 'Lê Thị C',
            email: 'lethic@example.com',
            phone: '0987654321',
            status: 'active',
            progress: 75
          }
        ],
        lessons: [
          {
            id: 1,
            course_id: 1,
            class_id: 1,
            module_id: 1,
            name: 'Giới thiệu về React Hooks',
            description: 'Tìm hiểu về các hooks cơ bản trong React',
            status: 'completed',
            type: 'Lý thuyết',
            sequence_number: 1,
            duration: 90,
            lesson_names: [
              "useState và cách sử dụng",
              "useEffect và lifecycle",
              "useContext và state management",
              "useRef và DOM manipulation",
              "useMemo và useCallback"
            ],
            content: 'Nội dung chi tiết về React Hooks...',
            resources: [
              {
                name: 'Slide bài giảng',
                type: 'PDF',
                url: 'https://example.com/slides.pdf'
              },
              {
                name: 'Code mẫu',
                type: 'GitHub',
                url: 'https://github.com/example/react-hooks'
              }
            ]
          },
          {
            id: 2,
            course_id: 1,
            class_id: 1,
            module_id: 1,
            name: 'Custom Hooks',
            description: 'Học cách tạo và sử dụng Custom Hooks',
            status: 'in_progress',
            type: 'Thực hành',
            sequence_number: 2,
            duration: 120,
            lesson_names: [
              "Tạo Custom Hook đầu tiên",
              "useLocalStorage hook",
              "useFetch hook",
              "useForm hook",
              "Best practices khi tạo Custom Hooks"
            ],
            content: 'Nội dung chi tiết về Custom Hooks...',
            resources: [
              {
                name: 'Bài tập thực hành',
                type: 'PDF',
                url: 'https://example.com/exercise.pdf'
              }
            ]
          }
        ]
      },
      {
        id: 2,
        course_id: 1,
        name: 'Lớp React A2',
        description: 'Lớp học cuối tuần',
        status: 'active',
        instructor: 'Phạm Thị D',
        schedule: 'Thứ 7, Chủ nhật - 8:30-11:30',
        startDate: '2024-03-02',
        endDate: '2024-06-02',
        duration: 180,
        studentCount: 12,
        maxStudents: 20,
        students: [],
        lessons: []
      }
    ]
  },
  {
    id: 2,
    name: 'Khóa học Node.js',
    description: 'Xây dựng ứng dụng backend với Node.js và Express',
    status: 'active',
    thumbnail: 'https://picsum.photos/800/400',
    classes: [
      {
        id: 3,
        course_id: 2,
        name: 'Lớp Node.js B1',
        description: 'Lớp học cơ bản về Node.js',
        status: 'active',
        instructor: 'Lê Văn E',
        schedule: 'Thứ 3, 5, 7 - 18:30-21:30',
        startDate: '2024-03-03',
        endDate: '2024-06-03',
        duration: 180,
        studentCount: 18,
        maxStudents: 25,
        students: [],
        lessons: []
      }
    ]
  }
]; 