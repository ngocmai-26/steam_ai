import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCoursesThunk,
  fetchCourseByIdThunk,
  createCourseThunk,
  updateCourseThunk,
  deleteCourseThunk,
} from '../thunks/courseThunks';

const initialState = {
  courses: [],
  currentCourse: null,
  currentClass: null,
  currentLesson: null,
  currentModule: null,
  selectedStudent: null,
  isLoading: false,
  error: null,
  isModalOpen: false,
  modalType: null,
  lastUpdate: Date.now()
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    // Course actions
    setCourses: (state, action) => {
      state.courses = action.payload;
      state.isLoading = false;
      state.error = null;
      state.lastUpdate = Date.now();
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
      state.lastUpdate = Date.now();
    },
    addCourse: (state, action) => {
      state.courses.push(action.payload);
      state.lastUpdate = Date.now();
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex(course => course.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
        if (state.currentCourse?.id === action.payload.id) {
          state.currentCourse = action.payload;
        }
      }
      state.lastUpdate = Date.now();
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter(course => course.id !== action.payload);
      if (state.currentCourse?.id === action.payload) {
        state.currentCourse = null;
      }
      state.lastUpdate = Date.now();
    },

    // Class actions
    setCurrentClass: (state, action) => {
      state.currentClass = action.payload;
      state.lastUpdate = Date.now();
    },
    addClassToCourse: (state, action) => {
      const { courseId, classData } = action.payload;
      const course = state.courses.find(c => c.id === courseId);
      if (course) {
        if (!course.classes) {
          course.classes = [];
        }
        course.classes.push(classData);
        if (state.currentCourse?.id === courseId) {
          state.currentCourse = course;
        }
      }
      state.lastUpdate = Date.now();
    },
    updateClassInCourse: (state, action) => {
      const { courseId, classData } = action.payload;
      const course = state.courses.find(c => c.id === courseId);
      if (course && course.classes) {
        const classIndex = course.classes.findIndex(c => c.id === classData.id);
        if (classIndex !== -1) {
          course.classes[classIndex] = classData;
          if (state.currentCourse?.id === courseId) {
            state.currentCourse = course;
          }
          if (state.currentClass?.id === classData.id) {
            state.currentClass = classData;
          }
        }
      }
      state.lastUpdate = Date.now();
    },
    deleteClassFromCourse: (state, action) => {
      const { courseId, classId } = action.payload;
      const course = state.courses.find(c => c.id === courseId);
      if (course && course.classes) {
        course.classes = course.classes.filter(c => c.id !== classId);
        if (state.currentCourse?.id === courseId) {
          state.currentCourse = course;
        }
        if (state.currentClass?.id === classId) {
          state.currentClass = null;
        }
      }
      state.lastUpdate = Date.now();
    },

    // Lesson actions
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
      state.lastUpdate = Date.now();
    },
    addLesson: (state, action) => {
      const { courseId, classId, lessonData } = action.payload;
      const course = state.courses.find(c => c.id === courseId);
      if (course) {
        const classItem = course.classes?.find(c => c.id === classId);
        if (classItem) {
          if (!classItem.lessons) {
            classItem.lessons = [];
          }
          classItem.lessons.push(lessonData);
        }
      }
      state.lastUpdate = Date.now();
    },
    updateLesson: (state, action) => {
      const { courseId, classId, lessonData } = action.payload;
      const course = state.courses.find(c => c.id === courseId);
      if (course) {
        const classItem = course.classes?.find(c => c.id === classId);
        if (classItem && classItem.lessons) {
          const lessonIndex = classItem.lessons.findIndex(l => l.id === lessonData.id);
          if (lessonIndex !== -1) {
            classItem.lessons[lessonIndex] = lessonData;
          }
        }
      }
      state.lastUpdate = Date.now();
    },
    deleteLesson: (state, action) => {
      const { courseId, classId, lessonId } = action.payload;
      const course = state.courses.find(c => c.id === courseId);
      if (course) {
        const classItem = course.classes?.find(c => c.id === classId);
        if (classItem && classItem.lessons) {
          classItem.lessons = classItem.lessons.filter(l => l.id !== lessonId);
        }
      }
      state.lastUpdate = Date.now();
    },

    // Module actions
    setCurrentModule: (state, action) => {
      state.currentModule = action.payload;
      state.lastUpdate = Date.now();
    },

    // Student actions
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
      state.lastUpdate = Date.now();
    },

    // Modal actions
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.modalType = action.payload.type;
      state.lastUpdate = Date.now();
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalType = null;
      state.currentClass = null;
      state.currentLesson = null;
      state.lastUpdate = Date.now();
    },

    // Loading and error states
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCoursesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoursesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCoursesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Course By ID
      .addCase(fetchCourseByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Course
      .addCase(createCourseThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCourseThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourseThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Course
      .addCase(updateCourseThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCourseThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.courses.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.currentCourse?.id === action.payload.id) {
            state.currentCourse = action.payload;
        }
      })
      .addCase(updateCourseThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Course
      .addCase(deleteCourseThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCourseThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = state.courses.filter(course => course.id !== action.payload);
         if (state.currentCourse?.id === action.payload) {
          state.currentCourse = null;
        }
      })
      .addCase(deleteCourseThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setCourses,
  setCurrentCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  setCurrentClass,
  addClassToCourse,
  updateClassInCourse,
  deleteClassFromCourse,
  setCurrentLesson,
  addLesson,
  updateLesson,
  deleteLesson,
  setCurrentModule,
  setSelectedStudent,
  openModal,
  closeModal,
  setLoading,
  setError
} = courseSlice.actions;

export default courseSlice.reducer; 