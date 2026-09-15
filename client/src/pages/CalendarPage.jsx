import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { PriorityBadge } from '../components/common/Badge';

export const CalendarPage = () => {
  const { tasks, projects, openModal } = useAppData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Generate days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // Pad previous month days
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push({ dayNumber: null, isCurrentMonth: false });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ dayNumber: d, isCurrentMonth: true });
  }

  // Get tasks for a given day
  const getTasksForDay = (dayNumber) => {
    if (!dayNumber) return [];
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === dayNumber
      );
    });
  };

  // Get projects with deadline on this day
  const getProjectsForDay = (dayNumber) => {
    if (!dayNumber) return [];
    return projects.filter((p) => {
      if (!p.deadline) return false;
      const d = new Date(p.deadline);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === dayNumber
      );
    });
  };

  const today = new Date();
  const isToday = (dayNumber) =>
    dayNumber &&
    today.getDate() === dayNumber &&
    today.getMonth() === month &&
    today.getFullYear() === year;

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="pulse-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#243447]">
              {monthNames[month]} {year}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF5E8] text-[#975A16] border border-[#F6E05E]/50">
              Sprint Timeline
            </span>
          </div>
          <p className="text-xs text-[#6B7280]">
            Click any scheduled task or project deadline to inspect deliverables
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl border border-[#E5DED2] text-xs font-bold text-[#243447] hover:bg-[#F3F0EA] transition-colors"
          >
            Today
          </button>
          <div className="flex items-center space-x-1 border border-[#E5DED2] rounded-xl p-1 bg-[#FFFCF8]">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-[#6B7280] hover:text-[#243447] hover:bg-[#F3F0EA]"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-[#6B7280] hover:text-[#243447] hover:bg-[#F3F0EA]"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => openModal('createTask')}
            className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-[#D8A48F] text-[#243447] text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="pulse-card overflow-hidden">
        {/* Day of Week Header */}
        <div className="grid grid-cols-7 border-b border-[#E5DED2] bg-[#F3F0EA]/60 text-center text-xs font-bold text-[#6B7280] py-3">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#E5DED2]/60">
          {calendarDays.map((cell, index) => {
            const dayTasks = getTasksForDay(cell.dayNumber);
            const dayProjects = getProjectsForDay(cell.dayNumber);
            const currentDayActive = isToday(cell.dayNumber);

            return (
              <div
                key={index}
                className={`min-h-[110px] sm:min-h-[130px] p-2 flex flex-col justify-between transition-colors ${
                  !cell.isCurrentMonth
                    ? 'bg-[#F3F0EA]/20 text-gray-300'
                    : currentDayActive
                    ? 'bg-[#E7E1F5]/20'
                    : 'bg-[#FFFCF8] hover:bg-[#F3F0EA]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      currentDayActive
                        ? 'bg-[#243447] text-white shadow-sm'
                        : 'text-[#243447]'
                    }`}
                  >
                    {cell.dayNumber || ''}
                  </span>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-semibold text-[#6B7280]">
                      {dayTasks.length} due
                    </span>
                  )}
                </div>

                {/* Day events badges */}
                <div className="space-y-1 my-1 overflow-y-auto max-h-20">
                  {dayProjects.map((p) => (
                    <div
                      key={p._id}
                      className="px-2 py-0.5 rounded text-[10px] font-bold truncate bg-[#D8A48F] text-[#243447] shadow-sm"
                      title={`Project Deadline: ${p.name}`}
                    >
                      🎯 {p.name}
                    </div>
                  ))}

                  {dayTasks.map((t) => {
                    const isDone = t.status === 'Completed';
                    return (
                      <div
                        key={t._id}
                        onClick={() => openModal('taskDetails', t)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate cursor-pointer transition-transform hover:scale-[1.02] ${
                          isDone
                            ? 'bg-[#EDF5EB] text-[#22543D] line-through'
                            : t.priority === 'Urgent'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-[#FFFCF8] border border-[#E5DED2] text-[#243447]'
                        }`}
                        title={t.title}
                      >
                        • {t.title}
                      </div>
                    );
                  })}
                </div>

                <div />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
