import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay, startOfWeek, addWeeks, subWeeks, parseISO } from 'date-fns';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LessonService } from '../services/LessonService';

const WEEKDAYS = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];

function getWeekDays(centerDay) {
    // Trả về 7 ngày của tuần chứa centerDay, bắt đầu từ Chủ nhật
    const start = startOfWeek(centerDay, { weekStartsOn: 0 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
}

const CalendarPage = () => {
    const user = useSelector(state => state.auth.user);
    const navigate = useNavigate();
    const today = new Date();
    const [startDate, setStartDate] = useState(format(today, 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(addDays(today, 6), 'yyyy-MM-dd'));
    const [selectedDay, setSelectedDay] = useState(today);
    const [carouselCenter, setCarouselCenter] = useState(today);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    // Luôn lấy đủ 7 ngày của tuần
    const weekDays = getWeekDays(carouselCenter);

    // Fetch lessons cho teacher
    useEffect(() => {
        const fetchLessons = async () => {
            if (!user?.id) return;

            setLoading(true);
            try {
                const params = { teacher: user.id };
                const lessonsData = await LessonService.getLessons(null, params);
                setLessons(lessonsData || []);
            } catch (error) {
                console.error('Error fetching lessons:', error);
                setLessons([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [user?.id]);

    // Lọc lessons cho ngày được chọn
    const getLessonsForDay = (day) => {
        const dayStr = format(day, 'dd/MM/yyyy');
        return lessons.filter(lesson => {
            if (!lesson.schedule) return false;
            return lesson.schedule.start_date === dayStr;
        });
    };

    const selectedDayLessons = getLessonsForDay(selectedDay);

    const handleSelectDay = (day) => {
        setSelectedDay(day);
        setCarouselCenter(day);
    };

    const handlePrevWeek = () => setCarouselCenter(subWeeks(carouselCenter, 1));
    const handleNextWeek = () => setCarouselCenter(addWeeks(carouselCenter, 1));

    return (
        <div className="bg-gray-50 py-8 px-2">
            <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto">
                <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-indigo-700 text-center tracking-tight">Thời khóa biểu</h1>

                {/* Date Range Selection */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6 w-full justify-center">
                    <div className="w-full sm:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                        <input
                            type="date"
                            value={startDate}
                            max={endDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="w-full sm:w-auto border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                        <input
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="w-full sm:w-auto border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                        />
                    </div>
                </div>

                {/* Day Carousel */}
                <div className="flex items-center justify-center gap-2 mb-6 w-full">
                    <button
                        onClick={handlePrevWeek}
                        className="px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-base font-bold shadow transition-colors"
                    >
                        &#60;
                    </button>

                    {/* Mobile: Grid layout để hiển thị đủ 7 ngày */}
                    <div className="hidden sm:flex flex-row gap-1 w-full justify-center overflow-x-auto px-1">
                        {weekDays.map((day, idx) => {
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                            const isSelected = isSameDay(day, selectedDay);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectDay(day)}
                                    className={`flex flex-col items-center px-1 py-2 rounded-lg border transition-all duration-150 min-w-[50px] text-xs font-medium flex-shrink-0
                    ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-lg' : 'bg-white text-gray-800 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'}
                    ${isWeekend ? 'text-red-500' : ''}
                    ${isSelected && isWeekend ? 'text-red-100' : ''}`}
                                >
                                    <span className="text-xs font-semibold uppercase">{WEEKDAYS[day.getDay()]}</span>
                                    <span className="text-xs">{format(day, 'dd-MM')}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile: Grid layout 7 cột */}
                    <div className="sm:hidden grid grid-cols-7 gap-1 w-full px-1">
                        {weekDays.map((day, idx) => {
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                            const isSelected = isSameDay(day, selectedDay);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectDay(day)}
                                    className={`flex flex-col items-center px-1 py-2 rounded-lg border transition-all duration-150 text-xs font-medium
                    ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-lg' : 'bg-white text-gray-800 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'}
                    ${isWeekend ? 'text-red-500' : ''}
                    ${isSelected && isWeekend ? 'text-red-100' : ''}`}
                                >
                                    <span className="text-xs font-semibold uppercase">{WEEKDAYS[day.getDay()]}</span>
                                    <span className="text-xs">{format(day, 'dd-MM')}</span>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleNextWeek}
                        className="px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-base font-bold shadow transition-colors"
                    >
                        &#62;
                    </button>
                </div>

                {/* Lesson Schedule */}
                <div className="mt-2 bg-white rounded-xl shadow p-4 w-full">
                    <div className="text-base font-semibold mb-3 text-indigo-700 text-center">
                        Lịch học ngày {format(selectedDay, 'dd/MM/yyyy')}
                    </div>

                    {loading ? (
                        <div className="text-gray-500 italic text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                            Đang tải...
                        </div>
                    ) : selectedDayLessons.length > 0 ? (
                        <div className="w-full space-y-3">
                            {selectedDayLessons.map((lesson, index) => (
                                <div
                                    key={lesson.id || index}
                                    className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-sm cursor-pointer"
                                    onClick={() => {
                                        // Lưu thông tin lesson vào localStorage trước khi navigate
                                        localStorage.setItem(`lesson_${lesson.id}`, JSON.stringify(lesson));
                                        navigate(`/lessons/${lesson.id}`);
                                    }}
                                >
                                    <div className="font-medium text-gray-900 text-sm sm:text-base mb-2">
                                        {lesson.name}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2 flex items-center">
                                        <span className="mr-2">🕒</span>
                                        {lesson.schedule?.start_time} - {lesson.schedule?.end_time}
                                        {lesson.schedule?.duration && (
                                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                {lesson.schedule.duration} phút
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center">
                                        <span className="mr-2">📊</span>
                                        Trạng thái:
                                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${lesson.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            lesson.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {lesson.status === 'completed' ? 'Đã hoàn thành' :
                                                lesson.status === 'in_progress' ? 'Đang diễn ra' : 'Chưa bắt đầu'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 italic text-center py-8">
                            <div className="text-4xl mb-2">📅</div>
                            Không có lịch học hôm nay.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage; 