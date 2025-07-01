import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModulesThunk, deleteModuleThunk } from '../thunks/moduleThunks';
import { fetchClasses } from '../thunks/classThunks';
import { openModal } from '../slices/modalSlice';
import Loading from '../components/Loading';
import ModalManager from '../components/ModalManager';

const Modules = () => {
    const dispatch = useDispatch();
    const { modules, isLoading, error } = useSelector((state) => state.module);
    const { classes, isLoading: classesLoading } = useSelector((state) => state.class);
    const [selectedClass, setSelectedClass] = useState('');

    useEffect(() => {
        dispatch(fetchClasses());
    }, [dispatch]);

    useEffect(() => {
        // Fetch modules for the selected class, or all if none is selected
        dispatch(fetchModulesThunk(selectedClass || null));
    }, [dispatch, selectedClass]);

    const handleAddModule = () => {
        dispatch(openModal({ type: 'addModule' }));
    };

    const handleEditModule = (module) => {
        dispatch(openModal({ type: 'editModule', data: { module } }));
    };

    const handleDeleteModule = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa học phần này?')) {
            dispatch(deleteModuleThunk(id));
        }
    };

    const handleClassFilterChange = (e) => {
        setSelectedClass(e.target.value);
    };

    if (isLoading) return <Loading />;
    if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý học phần</h1>
                <button
                    onClick={handleAddModule}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Thêm học phần
                </button>
            </div>

            <div className="mb-6">
                <label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 mb-2">Lọc theo lớp học:</label>
                <select
                    id="classFilter"
                    name="classFilter"
                    onChange={handleClassFilterChange}
                    value={selectedClass}
                    className="mt-1 block w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    disabled={classesLoading}
                >
                    <option value="">Tất cả các lớp</option>
                    {classes.map((classItem) => (
                        <option key={classItem.id} value={classItem.id}>{classItem.name}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {modules.length > 0 ? modules.map((module) => (
                        <li key={module.id} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-indigo-600 truncate">{module.name}</div>
                                <div className="ml-2 flex-shrink-0 flex space-x-2">
                                    <button onClick={() => handleEditModule(module)} className="text-gray-500 hover:text-gray-700">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteModule(module.id)} className="text-red-500 hover:text-red-700">
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        Thứ tự: {module.sequence_number}
                                    </p>
                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                        Số buổi học: {module.total_lessons}
                                    </p>
                                </div>
                            </div>
                        </li>
                    )) : (
                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500">Không có học phần nào.</li>
                    )}
                </ul>
            </div>
            
            <ModalManager />
        </div>
    );
};

export default Modules; 