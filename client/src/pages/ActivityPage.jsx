import React, { useState } from 'react';
import {
  Activity as ActivityIcon,
  CheckCircle2,
  MessageSquare,
  FolderKanban,
  UserPlus,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Avatar from '../components/common/Avatar';

export const ActivityPage = () => {
  const { activities, openModal } = useAppData();
  const [filterAction, setFilterAction] = useState('All');

  const filteredActivities = activities.filter((act) => {
    if (filterAction === 'All') return true;
    if (filterAction === 'tasks') return act.action.includes('task');
    if (filterAction === 'comments') return act.action === 'commented_task';
    if (filterAction === 'projects') return act.action.includes('project');
    return true;
  });

  const getActionIcon = (action) => {
    switch (action) {
      case 'completed_task':
        return <CheckCircle2 className="w-4 h-4 text-[#2F855A]" />;
      case 'commented_task':
        return <MessageSquare className="w-4 h-4 text-[#D8A48F]" />;
      case 'created_project':
        return <FolderKanban className="w-4 h-4 text-purple-600" />;
      case 'joined_team':
        return <UserPlus className="w-4 h-4 text-blue-600" />;
      default:
        return <ActivityIcon className="w-4 h-4 text-[#243447]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pulse-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#243447]">Team Activity Feed</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EDF5EB] text-[#22543D]">
              Live Audit Log
            </span>
          </div>
          <p className="text-xs text-[#6B7280]">
            Complete transparency into task updates, status changes, comments, and project milestones
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#F3F0EA] border border-[#E5DED2]">
          {[
            { label: 'All Updates', value: 'All' },
            { label: 'Tasks', value: 'tasks' },
            { label: 'Comments', value: 'comments' },
            { label: 'Projects', value: 'projects' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterAction(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterAction === tab.value
                  ? 'bg-[#FFFCF8] text-[#243447] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#243447]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="pulse-card p-6 sm:p-8">
        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5DED2]">
          {filteredActivities.map((act) => (
            <div key={act._id} className="relative flex items-start space-x-4 group">
              {/* Dot Icon on Timeline Line */}
              <div className="absolute -left-6 mt-1 w-6 h-6 rounded-full bg-[#FFFCF8] border border-[#E5DED2] flex items-center justify-center shadow-subtle group-hover:border-[#D8A48F]">
                {getActionIcon(act.action)}
              </div>

              {/* User Avatar */}
              <Avatar
                name={act.user?.name || 'Teammate'}
                avatar={act.user?.avatar}
                status={act.user?.status}
                size="md"
              />

              {/* Details card */}
              <div className="flex-1 p-4 rounded-xl bg-[#F3F0EA]/40 border border-[#E5DED2] hover:border-[#D8A48F] transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <span className="text-xs sm:text-sm font-bold text-[#243447]">
                    {act.user?.name || 'Teammate'}
                  </span>
                  <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {act.createdAt
                      ? new Date(act.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Recently'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#243447] leading-relaxed">
                  {act.details}
                </p>

                {act.task && (
                  <div className="mt-2 pt-2 border-t border-[#E5DED2]/50 flex items-center space-x-2 text-xs text-[#6B7280]">
                    <span className="font-semibold text-[#243447]">Task:</span>
                    <span>{act.task.title}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="text-center py-12 text-xs text-[#6B7280]">
              No activity matching this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
