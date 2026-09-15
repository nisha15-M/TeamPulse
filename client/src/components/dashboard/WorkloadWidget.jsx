import React from 'react';
import { Scale, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import Avatar from '../common/Avatar';
import { WorkloadBadge } from '../common/Badge';

export const WorkloadWidget = ({ workloadData = [] }) => {
  return (
    <div className="pulse-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#E7E1F5] text-[#243447]">
            <Scale className="w-5 h-5 text-[#243447]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#243447]">Workload Balance</h3>
            <p className="text-xs text-[#6B7280]">Capacity tracking to prevent team burnout</p>
          </div>
        </div>

        <span className="text-xs font-semibold text-[#6B7280]">
          Target: 4-6 tasks / member
        </span>
      </div>

      {/* Member Workload Rows */}
      <div className="space-y-4">
        {workloadData.map((item) => {
          const isHigh = item.workloadStatus === 'High';
          const isAvailable = item.workloadStatus === 'Available';

          // Progress bar color based on workload
          const barColor = isHigh
            ? 'bg-[#C53030]'
            : isAvailable
            ? 'bg-[#63B3ED]'
            : 'bg-[#A8C3A0]';

          return (
            <div
              key={item.user._id}
              className={`p-3.5 rounded-xl border transition-all ${
                isHigh
                  ? 'bg-red-50/40 border-red-200'
                  : 'bg-[#FFFCF8] border-[#E5DED2] hover:border-[#D8A48F]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Avatar
                    name={item.user.name}
                    avatar={item.user.avatar}
                    status={item.user.status}
                    size="sm"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#243447] block">
                      {item.user.name}
                    </span>
                    <span className="text-[11px] text-[#6B7280]">{item.user.title}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold text-[#243447]">
                      {item.assignedTasks}
                    </span>
                    <span className="text-[11px] text-[#6B7280] ml-1">tasks</span>
                  </div>
                  <WorkloadBadge workload={item.workloadStatus} />
                </div>
              </div>

              {/* Workload Capacity Bar */}
              <div className="w-full bg-[#E5DED2] rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.min(item.capacityPercent, 100)}%` }}
                />
              </div>

              {/* Status footer for overloaded members */}
              {isHigh && (
                <div className="mt-2 flex items-center space-x-1.5 text-[11px] font-semibold text-red-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>High workload detected — consider reassigning upcoming tasks.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkloadWidget;
