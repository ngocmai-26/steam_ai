import React, { useState } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';

const Attendance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    classId: '',
    date: '',
    students: [],
  });

  const columns = [
    { header: 'Lớp học', key: 'class' },
    { header: 'Ngày học', key: 'date' },
    { header: 'Số học viên có mặt', key: 'present' },
    { header: 'Số học viên vắng mặt', key: 'absent' },
    { header: 'Ghi chú', key: 'note' },
  ];

  const mockData = [
    {
      class: 'Python-01',
      date: '15/03/2024',
      present: '28',
      absent: '2',
      note: 'Học viên vắng có phép',
    },
    // Add more mock data as needed
  ];

  const mockStudents = [
    { id: 1, name: 'Nguyễn Văn A', status: true },
    { id: 2, name: 'Trần Thị B', status: true },
    { id: 3, name: 'Lê Văn C', status: false },
    // Add more mock students as needed
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentStatusChange = (studentId) => {
    setFormData((prev) => ({
      ...prev,
      students: prev.students.map((student) =>
        student.id === studentId
          ? { ...student, status: !student.status }
          : student
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Điểm danh lớp</h1>
      
      <Table
        columns={columns}
        data={mockData}
        onAdd={() => {
          setFormData((prev) => ({
            ...prev,
            students: mockStudents,
          }));
          setIsModalOpen(true);
        }}
        addButtonText="Điểm danh"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Điểm danh lớp học"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lớp học
            </label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Chọn lớp học</option>
              <option value="1">Python-01</option>
              <option value="2">Java-01</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày học
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh sách học viên
            </label>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Họ và tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleStudentStatusChange(student.id)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            student.status
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {student.status ? 'Có mặt' : 'Vắng mặt'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="mt-3 sm:mt-0 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Hủy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Attendance; 