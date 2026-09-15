import React from 'react';
import { Users, UserPlus, Trash2, Scale, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import { WorkloadBadge, RoleBadge } from '../components/common/Badge';

export const TeamsPage = () => {
  const { teams, workloadData, openModal, removeMember } = useAppData();
  const { user } = useAuth();

  const currentTeam = teams[0] || {
    name: 'Pulse Engineering Core',
    description: 'Cross-functional engineering and design team building college capstone and startup prototypes.',
  };

  const isLeaderOrAdmin = user?.role === 'Admin' || user?.role === 'Team Leader';

  const handleRemove = async (userId, memberName) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      await removeMember(currentTeam._id, userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Header Banner */}
      <div className="pulse-card p-6 sm:p-8 bg-gradient-to-br from-[#FFFCF8] to-[#E7E1F5]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D8A48F] flex items-center justify-center text-[#243447] shadow-sm flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-[#243447]">{currentTeam.name}</h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#A8C3A0]/30 text-[#22543D] border border-[#A8C3A0]/50">
                  Active Workspace
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1 max-w-2xl leading-relaxed">
                {currentTeam.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => openModal('inviteMember')}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#243447] hover:bg-[#1e2c3c] text-xs sm:text-sm font-semibold text-white shadow-sm transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Teammate</span>
          </button>
        </div>
      </div>

      {/* UNIQUE FEATURE: WORKLOAD BALANCE SECTION */}
      <div className="pulse-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-[#E5DED2]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#FAF5E8] text-[#975A16]">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#243447]">Team Workload Balancer</h2>
              <p className="text-xs text-[#6B7280]">
                Live capacity tracking to maintain healthy distribution and avoid delivery bottlenecks
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold">
            <span className="flex items-center gap-1 text-blue-600">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Available (&lt; 4)
            </span>
            <span className="flex items-center gap-1 text-green-700">
              <span className="w-2 h-2 rounded-full bg-[#A8C3A0]"></span> Balanced (4–6)
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Overloaded (&gt; 6)
            </span>
          </div>
        </div>

        {/* Workload Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5DED2] text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                <th className="py-3 px-4">Team Member</th>
                <th className="py-3 px-4 text-center">Assigned Tasks</th>
                <th className="py-3 px-4 text-center">Completed Tasks</th>
                <th className="py-3 px-4">Capacity Utilization</th>
                <th className="py-3 px-4 text-right">Workload Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DED2]/60">
              {workloadData.map((item) => {
                const isOverloaded = item.workloadStatus === 'High';
                const isAvailable = item.workloadStatus === 'Available';

                const barColor = isOverloaded
                  ? 'bg-[#C53030]'
                  : isAvailable
                  ? 'bg-blue-400'
                  : 'bg-[#A8C3A0]';

                return (
                  <tr
                    key={item.user._id}
                    className={`transition-colors ${
                      isOverloaded ? 'bg-red-50/30' : 'hover:bg-[#F3F0EA]/30'
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          name={item.user.name}
                          avatar={item.user.avatar}
                          status={item.user.status}
                          size="md"
                        />
                        <div>
                          <div className="text-sm font-bold text-[#243447] flex items-center gap-1.5">
                            {item.user.name}
                            {item.user._id === user?._id && (
                              <span className="text-[10px] bg-[#E7E1F5] text-[#243447] px-1.5 py-0.2 rounded font-semibold">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#6B7280]">{item.user.title}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="text-base font-extrabold text-[#243447]">
                        {item.assignedTasks}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="text-sm font-semibold text-[#2F855A]">
                        {item.completedTasks}
                      </span>
                    </td>

                    <td className="py-4 px-4 min-w-[180px]">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-[#E5DED2] rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${Math.min(item.capacityPercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#6B7280] w-10 text-right">
                          {item.capacityPercent}%
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <WorkloadBadge workload={item.workloadStatus} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Member Directory Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#243447]">Member Directory</h2>
          <span className="text-xs font-semibold text-[#6B7280]">
            {workloadData.length} team contributors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {workloadData.map((item) => (
            <div
              key={item.user._id}
              className="pulse-card p-5 flex flex-col justify-between hover:border-[#D8A48F]"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <Avatar
                    name={item.user.name}
                    avatar={item.user.avatar}
                    status={item.user.status}
                    size="lg"
                  />
                  <div className="flex items-center space-x-1">
                    <RoleBadge role={item.user.role} />
                    {isLeaderOrAdmin && item.user._id !== user?._id && (
                      <button
                        onClick={() => handleRemove(item.user._id, item.user.name)}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#243447]">{item.user.name}</h3>
                <p className="text-xs text-[#6B7280] mb-3">{item.user.title}</p>
                <p className="text-[11px] text-[#6B7280] truncate">{item.user.email}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5DED2] flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">
                  <strong className="text-[#243447]">{item.assignedTasks}</strong> active tasks
                </span>
                <span className="text-[#2F855A] font-semibold">
                  {item.completedTasks} done
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
