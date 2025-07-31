import React, { useState } from 'react';
import { format, addDays, isSameDay, startOfWeek, addWeeks, subWeeks, isWithinInterval, parseISO } from 'date-fns';
import vi from 'date-fns/locale/vi';

const WEEKDAYS = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];

function getWeekDays(centerDay) {
    // Trả về 7 ngày của tuần chứa centerDay, bắt đầu từ Chủ nhật
    const start = startOfWeek(centerDay, { weekStartsOn: 0 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
}

const CalendarPage = () => {
    const today = new Date();
    const [startDate, setStartDate] = useState(format(today, 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(addDays(today, 6), 'yyyy-MM-dd'));
    const [selectedDay, setSelectedDay] = useState(today);
    const [carouselCenter, setCarouselCenter] = useState(today);

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    // Luôn lấy đủ 7 ngày của tuần
    const weekDays = getWeekDays(carouselCenter);

    const handleSelectDay = (day, inRange) => {
        if (!inRange) return;
        setSelectedDay(day);
        setCarouselCenter(day);
    };

    const handlePrevWeek = () => setCarouselCenter(subWeeks(carouselCenter, 1));
    const handleNextWeek = () => setCarouselCenter(addWeeks(carouselCenter, 1));

    return (
        <div className="bg-gray-50 py-8 px-2">
            <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto">
                <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-indigo-700 text-center tracking-tight">Thời khóa biểu</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full justify-center">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                        <input
                            type="date"
                            value={startDate}
                            max={endDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="border rounded px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                        <input
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="border rounded px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                        />
                    </div>
                </div>
                {/* Thanh ngày ngang */}
                <div className="flex items-center justify-center gap-2 mb-6 w-full">
                    <button
                        onClick={handlePrevWeek}
                        className="px-2 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-base font-bold shadow"
                    >
                        &#60;
                    </button>
                    <div className="flex flex-row gap-2 w-full justify-center">
                        {weekDays.map((day, idx) => {
                            const inRange = isWithinInterval(day, { start, end });
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectDay(day, inRange)}
                                    disabled={!inRange}
                                    className={`flex flex-col items-center md:px-4 md:py-2 px-2 py-1 rounded-xl border transition-all duration-150 min-w-[48px] md:min-w-[70px] md:text-base text-sm font-medium
                    ${isSameDay(day, selectedDay) && inRange ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow' : 'bg-white text-gray-800 border-gray-200 hover:bg-indigo-50'}
                    ${(day.getDay() === 0 || day.getDay() === 6) ? 'text-red-500' : ''}
                    ${!inRange ? 'opacity-40 cursor-not-allowed' : ''}`}
                                >
                                    <span className="text-xs md:text-sm font-semibold uppercase">{WEEKDAYS[day.getDay()]}</span>
                                    <span className="text-xs md:text-base">{format(day, 'dd-MM')}</span>
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={handleNextWeek}
                        className="px-2 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-base font-bold shadow"
                    >
                        &#62;
                    </button>
                </div>
                {/* Lịch học của ngày được chọn */}
                <div className="mt-2 bg-white rounded-xl shadow p-4 w-full flex flex-col items-center">
                    <div className="text-base font-semibold mb-2 text-indigo-700">Lịch học ngày {format(selectedDay, 'dd/MM/yyyy')}</div>
                    <div className="text-gray-500 italic">Không có lịch học hôm nay.</div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage; 