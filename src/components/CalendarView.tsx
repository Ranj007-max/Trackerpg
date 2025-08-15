import React, { useMemo } from 'react';
import { Subject } from '../types';

interface CalendarViewProps {
  subjects: Subject[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ subjects }) => {
  const currentDate = new Date();

  const { month, year, firstDayOfMonth, daysInMonth } = useMemo(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { month, year, firstDayOfMonth, daysInMonth };
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const lectureDates = useMemo(() => {
    const dates = new Set<string>();
    subjects.forEach(subject => {
      subject.chapters.forEach(chapter => {
        chapter.lectures.forEach(lecture => {
          if (lecture.date) {
            dates.add(lecture.date);
          }
        });
      });
    });
    return dates;
  }, [subjects]);

  const calendarDays = useMemo(() => {
    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...blanks, ...days];
  }, [firstDayOfMonth, daysInMonth]);

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-slate-100">{`${monthName} ${year}`}</h3>
        {/* TODO: Add next/prev month controls */}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {dayHeaders.map(day => (
          <div key={day} className="font-semibold text-xs text-slate-400 uppercase">{day}</div>
        ))}
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-10 w-10" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasLecture = lectureDates.has(dateStr);

          const today = new Date();
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

          return (
            <div
              key={index}
              className={`relative flex items-center justify-center h-10 w-10 rounded-full text-sm transition-colors ${
                isToday ? 'bg-indigo-600 text-white font-bold' : 'text-slate-200'
              }`}
              title={hasLecture ? 'Lecture Day' : ''}
            >
              {day}
              {hasLecture && (
                <div className="absolute bottom-1.5 h-1.5 w-1.5 bg-cyan-400 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
