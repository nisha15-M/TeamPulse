import React, { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import TaskCard from '../tasks/TaskCard';
import { useAppData } from '../../context/AppDataContext';

export const KanbanColumn = ({
  status,
  title,
  tasks = [],
  tintClass,
  headerColor,
  onDropTask,
}) => {
  const { openModal } = useAppData();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && onDropTask) {
      onDropTask(taskId, status);
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('taskId', task._id);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-2xl p-4 transition-all min-h-[500px] border ${
        isDragOver ? 'border-[#D8A48F] ring-2 ring-[#D8A48F]/30 scale-[1.01]' : 'border-[#E5DED2]'
      } ${tintClass}`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5DED2]/60">
        <div className="flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${headerColor}`} />
          <h3 className="text-sm font-bold text-[#243447] tracking-tight">{title}</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 text-[#243447] border border-[#E5DED2]/60">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => openModal('createTask')}
          className="p-1 rounded-lg text-[#6B7280] hover:text-[#243447] hover:bg-white/60 transition-colors"
          title="Add task in this status"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Scroll Container */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            isDraggable={true}
            onDragStart={handleDragStart}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-[#E5DED2] rounded-xl bg-white/30">
            <span className="text-xs text-[#6B7280] font-medium">No tasks in {title}</span>
            <span className="text-[11px] text-[#6B7280]/70 mt-1">Drag a task here or click +</span>
          </div>
        )}
      </div>

      {/* Column quick add footer */}
      <button
        onClick={() => openModal('createTask')}
        className="mt-3 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-dashed border-[#E5DED2] text-xs font-semibold text-[#6B7280] hover:text-[#243447] hover:bg-white/80 transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Task</span>
      </button>
    </div>
  );
};

export default KanbanColumn;
