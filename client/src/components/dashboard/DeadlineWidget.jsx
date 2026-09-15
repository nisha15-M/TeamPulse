import React from 'react';
import { Calendar, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { PriorityBadge } from '../common/Badge';
import { useAppData } from '../../context/AppDataContext';

export const DeadlineWidget = ({ tasks = [] }) => {
  const { openModal } = useAppData();

  // Filter tasks that are not completed and sort by due date
  const activeTasks = tasks
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, isOverdue: true, days: diffDays };
    } else if (diffDays === 0) {
      return { text: 'Due Today', isToday: true, days: 0 };
    } else if (diffDays === 1) {
      return { text: 'Due Tomorrow', days: 1 };
    } else {
      return { text: `Due in ${diffDays} days`, days: diffDays };
    }
  };

  return (
    <div className="pulse-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#FAF5E8] text-[#975A16]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#243447]">Upcoming Deadlines</h3>
            <p className="text-xs text-[#6B7280]">Urgent deliverables and milestone target dates</p>
          </div>
        </div>

        <span className="text-xs font-semibold text-[#6B7280]">
          {activeTasks.length} pending
        </span>
      </div>

      <div className="space-y-3">
        {activeTasks.slice(0, 5).map((task) => {
          const timing = getDaysRemaining(task.dueDate);

          return (
            <div
              key={task._id}
              onClick={() => openModal('taskDetails', task)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:shadow-subtle ${
                timing.isOverdue
                  ? 'bg-red-50/40 border-red-200'
                  : timing.isToday
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-[#FFFCF8] border-[#E5DED2] hover:border-[#D8A48F]'
              }`}
            >
              <div className="flex items-start space-x-3 min-w-0 flex-1 mr-3">
                <div className="mt-1">
                  {timing.isOverdue ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Calendar className="w-4 h-4 text-[#6B7280]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-semibold text-[#243447] truncate block">
                    {task.title}
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[11px] text-[#6B7280]">
                      {task.project?.name || 'General Project'}
                    </span>
                    <span className="text-[10px] text-[#E5DED2]">•</span>
                    <span className="text-[11px] text-[#6B7280]">
                      {task.assignedTo?.name || 'Unassigned'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                <PriorityBadge priority={task.priority} />
                <span
                  className={`text-[11px] font-bold ${
                    timing.isOverdue
                      ? 'text-red-600'
                      : timing.isToday
                      ? 'text-amber-700'
                      : 'text-[#6B7280]'
                  }`}
                >
                  {timing.text}
                </span>
              </div>
            </div>
          );
        })}

        {activeTasks.length === 0 && (
          <div className="p-6 text-center text-xs text-[#6B7280] border border-dashed border-[#E5DED2] rounded-xl">
            🎉 All tasks are completed! Enjoy your day.
          </div>
        )}
      </div>
    </div>
  );
};

export default DeadlineWidget;
