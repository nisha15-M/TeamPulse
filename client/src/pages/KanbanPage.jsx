import React from 'react';
import KanbanBoard from '../components/kanban/KanbanBoard';

export const KanbanPage = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pulse-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#243447]">Kanban Task Board</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E7E1F5] text-[#243447]">
              Interactive Drag & Drop
            </span>
          </div>
          <p className="text-xs text-[#6B7280]">
            Drag cards across pastel-tinted columns to update statuses instantly
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] font-semibold text-[#6B7280]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B4A5D9]" />
            <span>To Do</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D8A48F]" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F0C987]" />
            <span>Review</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A8C3A0]" />
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Main Kanban Board Component */}
      <KanbanBoard />
    </div>
  );
};

export default KanbanPage;
