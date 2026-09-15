import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  KanbanSquare,
  FolderKanban,
  Users,
  Calendar,
  Activity,
  BarChart3,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/app/my-tasks', icon: CheckSquare },
    { name: 'Kanban Board', path: '/app/kanban', icon: KanbanSquare },
    { name: 'Projects', path: '/app/projects', icon: FolderKanban },
    { name: 'Teams & Workload', path: '/app/teams', icon: Users },
    { name: 'Calendar', path: '/app/calendar', icon: Calendar },
    { name: 'Activity Feed', path: '/app/activity', icon: Activity },
    { name: 'Analytics', path: '/app/analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#243447] text-[#F3F0EA] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2d425a]">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/app/dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-[#D8A48F] flex items-center justify-center text-[#243447] shadow-md">
              <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                TeamPulse
                <span className="w-2 h-2 rounded-full bg-[#A8C3A0] animate-pulse"></span>
              </div>
              <div className="text-[11px] text-[#A8C3A0] tracking-wider uppercase font-semibold">
                Collaborative Hub
              </div>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-5 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#D8A48F] text-[#243447] font-semibold shadow-sm'
                      : 'text-gray-300 hover:bg-[#2d425a] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#243447]' : 'text-gray-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-[#243447]" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Pro / Capstone Badge */}
        <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-[#2d425a]/60 border border-[#3b5573]/50">
          <div className="flex items-center space-x-2 text-xs font-medium text-[#D8A48F]">
            <Sparkles className="w-4 h-4 text-[#D8A48F]" />
            <span>TeamPulse v1.0</span>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">
            Workload balancing & smart collaboration active.
          </p>
        </div>

        {/* User Profile & Logout Bottom Bar */}
        <div className="p-3 border-t border-[#2d425a] bg-[#1e2c3c]">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#243447] transition-colors">
            <div className="flex items-center space-x-3 min-w-0">
              <Avatar
                name={user?.name || 'User'}
                avatar={user?.avatar}
                status={user?.status || 'online'}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
                  {user?.name}
                  {user?.role === 'Admin' && <ShieldCheck className="w-3.5 h-3.5 text-[#D8A48F]" />}
                </div>
                <div className="text-[11px] text-gray-400 truncate">
                  {user?.role}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#D8A48F] hover:bg-[#2d425a] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
