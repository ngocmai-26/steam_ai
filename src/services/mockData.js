// Mock data
const mockCourses = [
  {
    id: 1,
    code: "REACT-A1",
    name: "Khóa học React Nâng cao",
    description: "Khóa học React chuyên sâu cho người đi làm",
    thumbnail: "/images/courses/react-advanced.jpg",
    status: "active"
  },
  {
    id: 2,
    code: "PYTHON-B1",
    name: "Lập trình Python cơ bản",
    description: "Khóa học Python dành cho người mới bắt đầu",
    thumbnail: "/images/courses/python-basic.jpg",
    status: "active"
  }
];

const mockClasses = [
  {
    id: 1,
    code: "REACT-A1-C1",
    name: "Lớp React A1 - 2024",
    course_id: 1,
    description: "Lớp học buổi tối cho người đi làm",
    teacher: "Nguyễn Văn A",
    teaching_assistant: "Trần Thị B",
    max_students: 30,
    current_students: 2,
    start_date: "2024-01-15",
    end_date: "2024-04-15",
    room: "P.503",
    schedule: {
      monday: ["18:30", "21:30"],
      wednesday: ["18:30", "21:30"]
    },
    status: "active"
  },
  {
    id: 2,
    code: "PYTHON-B1-C1",
    name: "Lớp Python B1 - 2024",
    course_id: 2,
    description: "Lớp học cuối tuần cho người mới bắt đầu",
    teacher: "Lê Văn C",
    max_students: 25,
    current_students: 0,
    start_date: "2024-02-01",
    end_date: "2024-05-01",
    room: "P.401",
    schedule: {
      saturday: ["08:00", "11:00"],
      sunday: ["14:00", "17:00"]
    },
    status: "active"
  }
];

const mockStudents = [
  {
    id: "ST001",
    name: "Nguyễn Văn X",
    email: "x.nguyen@example.com",
    phone: "0901234567",
    avatar: "/images/avatars/student1.jpg",
    registrations: [
      {
        class_id: 1,
        course_id: 1,
        registration_date: "2024-01-01",
        status: "active"
      }
    ]
  },
  {
    id: "ST002",
    name: "Trần Thị Y",
    email: "y.tran@example.com",
    phone: "0909876543",
    avatar: "/images/avatars/student2.jpg",
    registrations: [
      {
        class_id: 1,
        course_id: 1,
        registration_date: "2024-01-02",
        status: "active"
      }
    ]
  }
];

const mockModules = [
  {
    id: 1,
    class_id: 1,
    name: "Module 1: Giới thiệu React",
    description: "Tổng quan về React và các khái niệm cơ bản",
    sequence_number: 1,
    total_lessons: 3,
    lesson_names: [
      "Bài 1: Giới thiệu về React và JSX",
      "Bài 2: Components và Props",
      "Bài 3: State và Lifecycle"
    ],
    status: "active"
  },
  {
    id: 2,
    class_id: 1,
    name: "Module 2: React Hooks",
    description: "Tìm hiểu về React Hooks và cách sử dụng",
    sequence_number: 2,
    total_lessons: 4,
    lesson_names: [
      "Bài 1: useState Hook",
      "Bài 2: useEffect Hook",
      "Bài 3: useContext Hook",
      "Bài 4: Custom Hooks"
    ],
    status: "active"
  }
];

const mockLessons = [
  {
    id: 1,
    module_id: 1,
    name: "Giới thiệu về React và JSX",
    description: "Tìm hiểu về React và cú pháp JSX",
    sequence_number: 1,
    duration: 120,
    objectives: "Hiểu được React là gì và cách sử dụng JSX",
    requirements: "Kiến thức cơ bản về HTML, CSS, JavaScript",
    lesson_names: [
      "Giới thiệu về React.js",
      "Cài đặt môi trường phát triển",
      "Tìm hiểu về JSX",
      "Cú pháp và quy tắc viết JSX",
      "Thực hành với JSX"
    ],
    materials: [
      {
        id: 1,
        type: "slide",
        name: "Slide bài giảng",
        url: "/materials/slides/react-intro.pdf"
      },
      {
        id: 2,
        type: "code",
        name: "Code mẫu",
        url: "/materials/code/react-examples.zip"
      }
    ],
    status: "active"
  },
  {
    id: 2,
    module_id: 1,
    name: "Components và Props",
    description: "Tìm hiểu về React Components và Props",
    sequence_number: 2,
    duration: 120,
    objectives: "Hiểu và sử dụng được Components, Props trong React",
    requirements: "Đã học xong bài Giới thiệu về React",
    lesson_names: [
      "Khái niệm về Components",
      "Function Components vs Class Components",
      "Props và cách truyền dữ liệu",
      "PropTypes và TypeScript",
      "Thực hành xây dựng UI với Components",
      "Best practices khi làm việc với Components"
    ],
    materials: [
      {
        id: 3,
        type: "slide",
        name: "Slide bài giảng",
        url: "/materials/slides/react-components.pdf"
      },
      {
        id: 4,
        type: "code",
        name: "Code mẫu",
        url: "/materials/code/components-examples.zip"
      }
    ],
    status: "active"
  },
  {
    id: 3,
    module_id: 2,
    name: "State và Lifecycle",
    description: "Tìm hiểu về State và vòng đời của Components",
    sequence_number: 1,
    duration: 150,
    objectives: "Hiểu và sử dụng được State, Lifecycle methods trong React",
    requirements: "Đã học xong bài Components và Props",
    lesson_names: [
      "State trong React",
      "useState hook",
      "useEffect hook",
      "Component Lifecycle",
      "Custom hooks",
      "State management patterns",
      "Thực hành quản lý state"
    ],
    materials: [
      {
        id: 5,
        type: "slide",
        name: "Slide bài giảng",
        url: "/materials/slides/react-state.pdf"
      },
      {
        id: 6,
        type: "code",
        name: "Code mẫu",
        url: "/materials/code/state-examples.zip"
      }
    ],
    status: "active"
  },
  {
    id: 4,
    module_id: 2,
    name: "Forms và Controlled Components",
    description: "Xử lý forms trong React",
    sequence_number: 2,
    duration: 120,
    objectives: "Nắm vững cách xử lý forms trong React",
    requirements: "Đã học xong bài State và Lifecycle",
    lesson_names: [
      "Controlled vs Uncontrolled Components",
      "Form validation",
      "React Hook Form",
      "Formik và Yup",
      "Xử lý file uploads",
      "Thực hành xây dựng form phức tạp"
    ],
    materials: [
      {
        id: 7,
        type: "slide",
        name: "Slide bài giảng",
        url: "/materials/slides/react-forms.pdf"
      },
      {
        id: 8,
        type: "code",
        name: "Code mẫu",
        url: "/materials/code/forms-examples.zip"
      }
    ],
    status: "active"
  }
];

const mockLessonEvaluations = [
  {
    id: 1,
    lesson_id: 1,
    student_id: "ST001",
    class_id: 1,
    module_id: 1,
    evaluation_date: "2024-03-15",
    attendance: "present",
    participation: 8,
    understanding: 7,
    homework_completion: 9,
    teacher_comments: "Học viên tham gia tích cực, hiểu bài tốt",
    student_feedback: "Bài giảng rất hay và dễ hiểu",
    status: "completed"
  },
  {
    id: 2,
    lesson_id: 1,
    student_id: "ST002",
    class_id: 1,
    module_id: 1,
    evaluation_date: "2024-03-15",
    attendance: "present",
    participation: 7,
    understanding: 8,
    homework_completion: 8,
    teacher_comments: "Cần cải thiện thêm về phần thực hành",
    student_feedback: "Mong được thực hành nhiều hơn",
    status: "completed"
  }
];

const mockEvaluationCriteria = [
  {
    id: 1,
    name: "Mức độ tập trung",
    code: "focus_score",
    options: [
      { score: 1, label: "Không tập trung: Thường xuyên mất tập trung, sao nhãng trong giờ học" },
      { score: 2, label: "Ít tập trung: Thỉnh thoảng bị phân tán, cần nhắc nhở" },
      { score: 3, label: "Tập trung khá: Duy trì được sự tập trung trong phần lớn thời gian" },
      { score: 4, label: "Tập trung tốt: Rất chú ý, ít khi bị sao nhãng" },
      { score: 5, label: "Hoàn toàn tập trung: Luôn giữ sự tập trung cao độ, chủ động tiếp thu" }
    ]
  },
  {
    id: 2,
    name: "Đi muộn/Trễ",
    code: "punctuality_score",
    options: [
      { score: 1, label: "Thường xuyên đi muộn/về sớm: Rất ít khi đúng giờ" },
      { score: 2, label: "Hay đi muộn/về sớm: Thường xuyên đến muộn hoặc về sớm" },
      { score: 3, label: "Thỉnh thoảng đi muộn/về sớm: Có một vài lần không đúng giờ" },
      { score: 4, label: "Hiếm khi đi muộn/về sớm: Gần như luôn đúng giờ" },
      { score: 5, label: "Luôn đúng giờ: Chưa bao giờ đi muộn hay về sớm" }
    ]
  },
  {
    id: 3,
    name: "Mức độ tương tác",
    code: "interaction_score",
    options: [
      { score: 1, label: "Thu động: Không đặt câu hỏi, không tham gia thảo luận" },
      { score: 2, label: "Ít tương tác: Đôi khi trả lời hoặc hỏi, chủ yếu nghe giảng" },
      { score: 3, label: "Tương tác trung bình: Có tham gia thảo luận, đặt câu hỏi khi cần" },
      { score: 4, label: "Tương tác tốt: Chủ động phát biểu, hỏi đáp, thảo luận" },
      { score: 5, label: "Tương tác xuất sắc: Luôn chủ động, dẫn dắt thảo luận, hỗ trợ bạn bè" }
    ]
  }
];

// Mock API Service
export const mockApiService = {
  // Course APIs
  getCourses: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockCourses];
  },

  getCourseById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const course = mockCourses.find(c => c.id === id);
    if (!course) throw new Error('Course not found');
    return { ...course };
  },

  createCourse: async (courseData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCourse = {
      id: mockCourses.length + 1,
      ...courseData,
      status: 'active'
    };
    mockCourses.push(newCourse);
    return { ...newCourse };
  },

  updateCourse: async (id, courseData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockCourses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');
    mockCourses[index] = { ...mockCourses[index], ...courseData };
    return { ...mockCourses[index] };
  },

  deleteCourse: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockCourses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');
    mockCourses.splice(index, 1);
  },

  // Class APIs
  getClasses: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockClasses];
  },

  getClassById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const classData = mockClasses.find(c => c.id === id);
    if (!classData) throw new Error('Class not found');
    return { ...classData };
  },

  getClassesByCourseId: async (courseId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockClasses.filter(c => c.course_id === courseId).map(c => ({ ...c }));
  },

  createClass: async (classData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newClass = {
      id: mockClasses.length + 1,
      ...classData,
      current_students: 0,
      status: 'active'
    };
    mockClasses.push(newClass);
    return { ...newClass };
  },

  updateClass: async (id, classData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockClasses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Class not found');
    mockClasses[index] = { ...mockClasses[index], ...classData };
    return { ...mockClasses[index] };
  },

  deleteClass: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockClasses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Class not found');
    mockClasses.splice(index, 1);
  },

  // Module APIs
  getModules: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockModules];
  },

  getModulesByClassId: async (classId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockModules.filter(m => m.class_id === classId).map(m => ({ ...m }));
  },

  createModule: async (classId, moduleData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create new module
    const newModule = {
      id: mockModules.length + 1,
      class_id: classId,
      ...moduleData,
      status: 'active',
      total_lessons: moduleData.lesson_names?.length || 0
    };
    mockModules.push(newModule);

    // Automatically create lessons for the new module
    if (moduleData.lesson_names && moduleData.lesson_names.length > 0) {
      moduleData.lesson_names.forEach((lessonName, index) => {
        const newLesson = {
          id: mockLessons.length + 1,
          module_id: newModule.id,
          name: lessonName,
          description: `Nội dung cho ${lessonName}`,
          sequence_number: index + 1,
          duration: 120, // Default duration in minutes
          objectives: `Mục tiêu cho ${lessonName}`,
          requirements: "Chưa có yêu cầu",
          materials: [],
          status: 'active'
        };
        mockLessons.push(newLesson);
      });
    }

    return { ...newModule };
  },

  updateModule: async (id, moduleData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockModules.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Module not found');

    // Update module data
    const updatedModule = {
      ...mockModules[index],
      ...moduleData,
      total_lessons: moduleData.lesson_names?.length || mockModules[index].total_lessons
    };
    mockModules[index] = updatedModule;

    // Note: When updating a module, we don't automatically modify its lessons
    // Use lesson APIs to manage lessons of existing modules

    return { ...updatedModule };
  },

  deleteModule: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockModules.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Module not found');

    // Delete all lessons associated with this module
    const moduleId = mockModules[index].id;
    const lessonIndexesToDelete = mockLessons
      .map((lesson, index) => lesson.module_id === moduleId ? index : -1)
      .filter(index => index !== -1)
      .sort((a, b) => b - a); // Sort in descending order to safely splice

    lessonIndexesToDelete.forEach(lessonIndex => {
      mockLessons.splice(lessonIndex, 1);
    });

    // Delete the module
    mockModules.splice(index, 1);
  },

  // Lesson APIs
  getLessons: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockLessons];
  },

  getLessonsByModuleId: async (moduleId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLessons.filter(l => l.module_id === moduleId).map(l => ({ ...l }));
  },

  createLesson: async (moduleId, lessonData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the module
    const module = mockModules.find(m => m.id === moduleId);
    if (!module) throw new Error('Module not found');

    // Create new lesson
    const newLesson = {
      id: mockLessons.length + 1,
      module_id: moduleId,
      sequence_number: module.total_lessons + 1,
      ...lessonData,
      status: 'active'
    };
    mockLessons.push(newLesson);

    // Update module's lesson count and lesson names
    module.total_lessons += 1;
    module.lesson_names = module.lesson_names || [];
    module.lesson_names.push(lessonData.name);

    return { ...newLesson };
  },

  updateLesson: async (id, lessonData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockLessons.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lesson not found');

    const oldLesson = mockLessons[index];
    const updatedLesson = {
      ...oldLesson,
      ...lessonData
    };
    mockLessons[index] = updatedLesson;

    // Update module's lesson names if name changed
    if (lessonData.name && lessonData.name !== oldLesson.name) {
      const module = mockModules.find(m => m.id === oldLesson.module_id);
      if (module && module.lesson_names) {
        const lessonIndex = module.lesson_names.findIndex(name => name === oldLesson.name);
        if (lessonIndex !== -1) {
          module.lesson_names[lessonIndex] = lessonData.name;
        }
      }
    }

    return { ...updatedLesson };
  },

  deleteLesson: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockLessons.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lesson not found');

    const deletedLesson = mockLessons[index];
    
    // Update module's lesson count and lesson names
    const module = mockModules.find(m => m.id === deletedLesson.module_id);
    if (module) {
      module.total_lessons -= 1;
      module.lesson_names = module.lesson_names.filter(name => name !== deletedLesson.name);

      // Update sequence numbers of remaining lessons
      mockLessons
        .filter(l => l.module_id === module.id && l.sequence_number > deletedLesson.sequence_number)
        .forEach(l => l.sequence_number -= 1);
    }

    mockLessons.splice(index, 1);
  },

  // Lesson Evaluation APIs
  getLessonEvaluations: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockLessonEvaluations];
  },

  getLessonEvaluationsByLessonId: async (lessonId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLessonEvaluations.filter(e => e.lesson_id === lessonId).map(e => ({ ...e }));
  },

  getLessonEvaluationsByStudentId: async (studentId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLessonEvaluations.filter(e => e.student_id === studentId).map(e => ({ ...e }));
  },

  createLessonEvaluation: async (evaluationData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newEvaluation = {
      id: mockLessonEvaluations.length + 1,
      ...evaluationData,
      status: 'completed'
    };
    mockLessonEvaluations.push(newEvaluation);
    return { ...newEvaluation };
  },

  updateLessonEvaluation: async (id, evaluationData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockLessonEvaluations.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Evaluation not found');
    mockLessonEvaluations[index] = { ...mockLessonEvaluations[index], ...evaluationData };
    return { ...mockLessonEvaluations[index] };
  },

  deleteLessonEvaluation: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockLessonEvaluations.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Evaluation not found');
    mockLessonEvaluations.splice(index, 1);
  },

  // Student APIs
  getStudents: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockStudents];
  },

  getStudentsByClassId: async (classId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStudents
      .filter(s => s.registrations.some(r => r.class_id === classId && r.status === 'active'))
      .map(s => ({ ...s }));
  },

  registerStudent: async (studentId, classId, courseId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found');
    
    const registration = {
      class_id: classId,
      course_id: courseId,
      registration_date: new Date().toISOString(),
      status: 'active'
    };
    
    student.registrations.push(registration);
    return { ...student };
  },

  unregisterStudent: async (studentId, classId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found');
    
    const regIndex = student.registrations.findIndex(r => r.class_id === classId);
    if (regIndex === -1) throw new Error('Registration not found');
    
    student.registrations[regIndex].status = 'inactive';
    return { ...student };
  },

  getEvaluationCriteria: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockEvaluationCriteria];
  }
};

// Export mock data for direct access if needed
export {
  mockCourses,
  mockClasses,
  mockStudents,
  mockModules,
  mockLessons,
  mockLessonEvaluations,
  mockEvaluationCriteria
}; 