import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockStudents } from '../mockData/students';

// Async thunk for fetching students
export const fetchStudents = createAsyncThunk(
  'student/fetchStudents',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStudents;
  }
);

const initialState = {
  students: mockStudents,
  currentStudent: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setCurrentStudent: (state, action) => {
      state.currentStudent = action.payload;
    },
    addStudent: (state, action) => {
      const newStudent = {
        ...action.payload,
        id: state.students.length + 1,
        registrations: []
      };
      state.students.push(newStudent);
    },
    updateStudent: (state, action) => {
      const index = state.students.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = {
          ...state.students[index],
          ...action.payload,
          registrations: state.students[index].registrations || []
        };
        if (state.currentStudent?.id === action.payload.id) {
          state.currentStudent = state.students[index];
        }
      }
    },
    deleteStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload);
      if (state.currentStudent?.id === action.payload) {
        state.currentStudent = null;
      }
    },
    registerStudentToClass: (state, action) => {
      const { studentId, courseId, classId } = action.payload;
      const studentIndex = state.students.findIndex(s => s.id === studentId);
      
      if (studentIndex !== -1) {
        const student = state.students[studentIndex];
        
        // Check if student is already registered
        const isAlreadyRegistered = student.registrations.some(
          reg => reg.class_id === classId && reg.status === 'active'
        );

        if (!isAlreadyRegistered) {
          // Add new registration
          student.registrations.push({
            class_id: classId,
            course_id: courseId,
            registration_date: new Date().toISOString(),
            status: 'active'
          });

          // Update current student if it's the same student
          if (state.currentStudent?.id === studentId) {
            state.currentStudent = student;
          }
        }
      }
    },
    unregisterStudentFromClass: (state, action) => {
      const { studentId, classId } = action.payload;
      const studentIndex = state.students.findIndex(s => s.id === studentId);
      
      if (studentIndex !== -1) {
        const student = state.students[studentIndex];
        
        // Find and update the registration status
        const registration = student.registrations.find(reg => reg.class_id === classId);
        if (registration) {
          registration.status = 'inactive';
        }

        // Update current student if it's the same student
        if (state.currentStudent?.id === studentId) {
          state.currentStudent = student;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const {
  setCurrentStudent,
  addStudent,
  updateStudent,
  deleteStudent,
  registerStudentToClass,
  unregisterStudentFromClass
} = studentSlice.actions;

export default studentSlice.reducer; 