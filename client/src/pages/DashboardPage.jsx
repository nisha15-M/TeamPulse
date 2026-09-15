import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  Users,
  Plus,
  ArrowRight,
  FolderKanban,
  Activity as ActivityIcon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import StatCard from '../components/dashboard/StatCard';
import TeamPulseWidget from '../components/dashboard/TeamPulseWidget';
import WorkloadWidget from '../components/dashboard/WorkloadWidget';
import DeadlineWidget from '../components/dashboard/DeadlineWidget';
import Avatar from '../components/common/Avatar';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { tasks, projects, workloadData, activities, openModal } = useAppData();
  const navigate = useNavigate();

  // Dynamic greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const totalMembers = workloadData.length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="pulse-card p-6 sm:p-8 bg-gradient-to-r from-[#FFFCF8] via-[#E7E1F5]/40 to-[#FFFCF8] border border-[#E5DED2]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFFCF8] border border-[#E5DED2] text-xs font-semibold text-[#243447] mb-2 shadow-subtle">
              <Sparkles className="w-3.5 h-3.5 text-[#D8A48F]" />
              <span>Personalized Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243447] tracking-tight">
              {getGreeting()}, {user?.name || 'Nishashree'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1 font-medium">
              "Small steps every day lead to big results."
            </p>
          </div>

          {/* Quick Actions Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openModal('createTask')}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#D8A48F] hover:bg-[#c99580] text-xs sm:text-sm font-semibold text-[#243447] shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
            <button
              onClick={() => openModal('createProject')}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#FFFCF8] border border-[#E5DED2] hover:border-[#D8A48F] text-xs sm:text-sm font-semibold text-[#243447] shadow-subtle transition-all"
            >
              <FolderKanban className="w-4 h-4 text-[#D8A48F]" />
              <span>New Project</span>
            </button>
            <button
              onClick={() => openModal('inviteMember')}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#FFFCF8] border border-[#E5DED2] hover:border-[#D8A48F] text-xs sm:text-sm font-semibold text-[#243447] shadow-subtle transition-all"
            >
              <Users className="w-4 h-4 text-[#A8C3A0]" />
              <span>Invite Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          subtitle="Across all workspace projects"
          icon={CheckSquare}
          color="slate"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          subtitle={`${Math.round((pendingTasks / (totalTasks || 1)) * 100)}% active in progress`}
          icon={Clock}
          color="terracotta"
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasks}
          subtitle="Successfully delivered"
          icon={CheckCircle2}
          badge={`${Math.round((completedTasks / (totalTasks || 1)) * 100)}%`}
          color="sage"
        />
        <StatCard
          title="Team Members"
          value={totalMembers}
          subtitle="Active collaborators"
          icon={Users}
          color="lavender"
        />
      </div>

      {/* Section 1: Team Pulse Widget */}
      <TeamPulseWidget tasks={tasks} workloadData={workloadData} projects={projects} />

      {/* Section 2 & 3: Workload Balance & Upcoming Deadlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Balance */}
        <WorkloadWidget workloadData={workloadData} />

        {/* Upcoming Deadlines */}
        <DeadlineWidget tasks={tasks} />
      </div>

      {/* Section 4 & 5: Recent Activity & Project Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Timeline (2 columns) */}
        <div className="pulse-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#EDF5EB] text-[#2F855A]">
                <ActivityIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#243447]">Recent Activity</h3>
                <p className="text-xs text-[#6B7280]">Live feed of team updates and achievements</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/app/activity')}
              className="text-xs font-semibold text-[#D8A48F] hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {activities.slice(0, 5).map((act) => (
              <div
                key={act._id}
                className="p-3 rounded-xl bg-[#F3F0EA]/40 border border-[#E5DED2]/60 flex items-start space-x-3"
              >
                <Avatar
                  name={act.user?.name || 'Member'}
                  avatar={act.user?.avatar}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#243447] leading-relaxed">
                    {act.details}
                  </p>
                  <span className="text-[10px] text-[#6B7280] mt-0.5 block">
                    {act.createdAt ? new Date(act.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  </span>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <p className="text-xs text-[#6B7280] text-center py-6">No recent activities recorded.</p>
            )}
          </div>
        </div>

        {/* Project Progress Widget (1 column) */}
        <div className="pulse-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#E7E1F5] text-[#243447]">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#243447]">Projects</h3>
                  <p className="text-xs text-[#6B7280]">Active project velocity</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/app/projects')}
                className="text-xs font-semibold text-[#D8A48F] hover:underline"
              >
                View
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((proj) => (
                <div
                  key={proj._id}
                  onClick={() => navigate('/app/kanban')}
                  className="p-3 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] hover:border-[#D8A48F] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#243447] truncate max-w-[170px]">
                      {proj.name}
                    </span>
                    <span className="text-xs font-extrabold text-[#243447]">
                      {proj.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-[#E5DED2] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${proj.progress || 0}%`,
                        backgroundColor: proj.color || '#D8A48F',
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mt-2">
                    <span>{proj.completedTasks || 0} / {proj.totalTasks || 0} tasks</span>
                    <span>{proj.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => openModal('createProject')}
            className="mt-4 w-full py-2 rounded-xl border border-dashed border-[#E5DED2] hover:border-[#D8A48F] text-xs font-semibold text-[#243447] flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#D8A48F]" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
