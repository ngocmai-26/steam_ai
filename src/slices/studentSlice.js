import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockStudents } from '../mockData/students';
import { StudentService } from '../services/StudentService';

// Async thunk for fetching students
export const fetchStudents = createAsyncThunk(
  'student/fetchStudents',
  async () => {
    const data = await StudentService.getStudents();
    return data;
  }
);

export const addStudentAsync = createAsyncThunk(
  'student/addStudent',
  async (studentData) => {
    const data = await StudentService.createStudent(studentData);
    return data;
  }
);

export const updateStudentAsync = createAsyncThunk(
  'student/updateStudent',
  async ({ id, studentData }) => {
    const data = await StudentService.updateStudent(id, studentData);
    return data;
  }
);

export const deleteStudentAsync = createAsyncThunk(
  'student/deleteStudent',
  async (id) => {
    await StudentService.deleteStudent(id);
    return id;
  }
);

export const fetchStudentDetail = createAsyncThunk(
  'student/fetchStudentDetail',
  async (id) => {
    const data = await StudentService.getStudentById(id);
    return data;
  }
);

const initialState = {
  students: [],
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
        // Đảm bảo registrations là mảng
        const registrations = Array.isArray(student.registrations) ? student.registrations : [];
        // Find and update the registration status
        const registration = registrations.find(reg => reg.class_id === classId);
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
      })
      .addCase(addStudentAsync.fulfilled, (state, action) => {
        state.students.push(action.payload);
      })
      .addCase(updateStudentAsync.fulfilled, (state, action) => {
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(deleteStudentAsync.fulfilled, (state, action) => {
        state.students = state.students.filter(s => s.id !== action.payload);
      })
      .addCase(fetchStudentDetail.fulfilled, (state, action) => {
        state.currentStudent = action.payload;
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