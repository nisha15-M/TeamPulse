import React from 'react';
import { Activity, Zap, CheckCircle2, TrendingUp, ShieldAlert } from 'lucide-react';
import Avatar from '../common/Avatar';

export const TeamPulseWidget = ({ tasks = [], workloadData = [], projects = [] }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed'
  ).length;

  // Calculate Health Score: base 100, minus 5 for each overdue task, plus completion ratio bonus
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  let healthScore = Math.max(20, Math.min(100, Math.round(75 + completionRate * 0.25 - overdueTasks * 6)));

  let healthStatus = 'Optimal';
  let healthColor = 'text-[#2F855A] bg-[#EDF5EB] border-[#C6F6D5]';

  if (healthScore < 60 || overdueTasks >= 3) {
    healthStatus = 'Needs Attention';
    healthColor = 'text-[#C53030] bg-[#FBE8E8] border-[#F5C6CB]';
  } else if (healthScore < 80) {
    healthStatus = 'Moderate';
    healthColor = 'text-[#975A16] bg-[#FAF5E8] border-[#F6E05E]';
  }

  const onlineMembers = workloadData.filter((w) => w.user.status === 'online');

  return (
    <div className="pulse-card p-6 bg-gradient-to-br from-[#FFFCF8] to-[#F3F0EA]/40">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#D8A48F]/20 text-[#243447]">
            <Activity className="w-5 h-5 text-[#D8A48F]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#243447]">Team Pulse</h3>
            <p className="text-xs text-[#6B7280]">Live team velocity and sprint health metrics</p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${healthColor}`}>
          <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
          <span>Health: {healthScore}% • {healthStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Members Pulse */}
        <div className="p-4 rounded-xl bg-[#FFFCF8] border border-[#E5DED2]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] block mb-2">
            Active Collaborators
          </span>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {workloadData.slice(0, 4).map((w) => (
                <Avatar
                  key={w.user._id}
                  name={w.user.name}
                  avatar={w.user.avatar}
                  status={w.user.status}
                  size="sm"
                  className="ring-2 ring-white"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#2F855A] bg-[#EDF5EB] px-2 py-0.5 rounded-full">
              {onlineMembers.length} online
            </span>
          </div>
        </div>

        {/* Completed velocity */}
        <div className="p-4 rounded-xl bg-[#FFFCF8] border border-[#E5DED2]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] block mb-1">
            Completion Rate
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#243447]">{Math.round(completionRate)}%</span>
            <span className="text-xs text-[#6B7280]">({completedTasks}/{totalTasks} tasks)</span>
          </div>
          <div className="w-full bg-[#E5DED2] rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#A8C3A0] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Project Health / Overdue indicator */}
        <div className="p-4 rounded-xl bg-[#FFFCF8] border border-[#E5DED2]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] block mb-1">
            Risk & Overdue
          </span>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-bold ${overdueTasks > 0 ? 'text-[#C53030]' : 'text-[#2F855A]'}`}>
              {overdueTasks}
            </span>
            <span className="text-xs text-[#6B7280]">tasks past deadline</span>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1.5 flex items-center gap-1">
            {overdueTasks > 0 ? (
              <ShieldAlert className="w-3.5 h-3.5 text-[#C53030]" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F855A]" />
            )}
            <span>{overdueTasks > 0 ? 'Action required on blockers' : 'All deadlines on schedule'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamPulseWidget;
