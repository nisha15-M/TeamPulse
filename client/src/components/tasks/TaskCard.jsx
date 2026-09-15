import React from 'react';
import { Calendar, MessageSquare, MoreVertical, CheckCircle2, Clock } from 'lucide-react';
import Avatar from '../common/Avatar';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { useAppData } from '../../context/AppDataContext';

export const TaskCard = ({ task, isDraggable = false, onDragStart }) => {
  const { openModal, updateTask } = useAppData();

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'Completed';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => onDragStart && onDragStart(e, task)}
      onClick={() => openModal('taskDetails', task)}
      className="p-4 rounded-xl bg-[#FFFCF8] border border-[#E5DED2] shadow-subtle hover:shadow-card hover:border-[#D8A48F] transition-all cursor-pointer group select-none"
    >
      {/* Top row: Project Tag & Priority */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-[#6B7280] truncate max-w-[140px]">
          {task.project?.name || 'General'}
        </span>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Task Title */}
      <h4 className="text-xs sm:text-sm font-bold text-[#243447] group-hover:text-[#D8A48F] transition-colors leading-snug line-clamp-2 mb-1.5">
        {task.title}
      </h4>

      {/* Short description */}
      {task.description && (
        <p className="text-[11px] text-[#6B7280] line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Footer: Due Date, Comments, Assignee */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5DED2]/60 mt-2">
        <div className="flex items-center space-x-3 text-[11px]">
          <div
            className={`flex items-center space-x-1 ${
              isOverdue ? 'text-red-600 font-bold' : 'text-[#6B7280]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(task.dueDate)}</span>
          </div>

          <div className="flex items-center space-x-1 text-[#6B7280]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{task.comments?.length || 0}</span>
          </div>
        </div>

        <Avatar
          name={task.assignedTo?.name || 'Unassigned'}
          avatar={task.assignedTo?.avatar}
          status={task.assignedTo?.status}
          size="xs"
        />
      </div>
    </div>
  );
};

export default TaskCard;
