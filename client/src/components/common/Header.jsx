import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Plus,
  Menu,
  CheckCircle2,
  Clock,
  LogOut,
  ChevronDown,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import Avatar from './Avatar';
import { RoleBadge } from './Badge';

export const Header = ({ onMenuClick }) => {
  const { user, logout, demoLogin } = useAuth();
  const { globalSearch, setGlobalSearch, openModal, tasks, projects } = useAppData();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const quickAddRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(e.target)) {
        setShowQuickAddMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter count for notifications (e.g. tasks due soon)
  const urgentTasks = tasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed');

  const notifications = [
    {
      id: 1,
      title: 'Review Capstone Presentation',
      desc: 'Nishashree requested code review on CampusAI Portal',
      time: '10m ago',
      icon: <Clock className="w-4 h-4 text-[#D8A48F]" />,
    },
    {
      id: 2,
      title: 'Workload Alert',
      desc: 'Rahul Sharma currently has 8 active tasks (Overloaded)',
      time: '1h ago',
      icon: <CheckCircle2 className="w-4 h-4 text-[#A8C3A0]" />,
    },
    {
      id: 3,
      title: 'Database Setup Completed',
      desc: 'Karthik Verma completed Mongoose connection pool',
      time: '3h ago',
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-[#FFFCF8]/90 backdrop-blur-md border-b border-[#E5DED2]">
      {/* Left side: Mobile menu toggle + Global Search */}
      <div className="flex items-center space-x-3 flex-1 max-w-lg">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-[#243447] hover:bg-[#F3F0EA] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7280]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search tasks, projects, or team members..."
            className="w-full pl-10 pr-4 py-2 bg-[#F3F0EA] border border-transparent hover:border-[#E5DED2] focus:border-[#D8A48F] focus:bg-[#FFFCF8] rounded-xl text-xs sm:text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none transition-all shadow-inner"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#6B7280] hover:text-[#243447]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right side: Quick Add button + Notifications + Profile dropdown */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Add Menu */}
        <div className="relative" ref={quickAddRef}>
          <button
            onClick={() => setShowQuickAddMenu(!showQuickAddMenu)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-[#D8A48F] hover:bg-[#c99580] text-[#243447] rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showQuickAddMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#FFFCF8] rounded-xl shadow-floating border border-[#E5DED2] py-2 z-50 animate-fade-in">
              <button
                onClick={() => {
                  setShowQuickAddMenu(false);
                  openModal('createTask');
                }}
                className="w-full text-left px-4 py-2 text-xs sm:text-sm text-[#243447] hover:bg-[#F3F0EA] flex items-center space-x-2"
              >
                <span className="w-2 h-2 rounded-full bg-[#D8A48F]"></span>
                <span>New Task</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickAddMenu(false);
                  openModal('createProject');
                }}
                className="w-full text-left px-4 py-2 text-xs sm:text-sm text-[#243447] hover:bg-[#F3F0EA] flex items-center space-x-2"
              >
                <span className="w-2 h-2 rounded-full bg-[#A8C3A0]"></span>
                <span>New Project</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickAddMenu(false);
                  openModal('inviteMember');
                }}
                className="w-full text-left px-4 py-2 text-xs sm:text-sm text-[#243447] hover:bg-[#F3F0EA] flex items-center space-x-2"
              >
                <span className="w-2 h-2 rounded-full bg-[#B4A5D9]"></span>
                <span>Invite Team Member</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-[#243447] hover:bg-[#F3F0EA] border border-transparent hover:border-[#E5DED2] transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-[#243447]" />
            {urgentTasks.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D8A48F] rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFCF8] rounded-2xl shadow-floating border border-[#E5DED2] py-3 z-50 animate-fade-in">
              <div className="px-4 pb-2 border-b border-[#E5DED2] flex items-center justify-between">
                <span className="text-sm font-bold text-[#243447]">Team Notifications</span>
                <span className="text-[11px] bg-[#E7E1F5] text-[#243447] px-2 py-0.5 rounded-full font-semibold">
                  {notifications.length} new
                </span>
              </div>
              <div className="divide-y divide-[#E5DED2]/60 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3.5 hover:bg-[#F3F0EA] transition-colors flex items-start space-x-3">
                    <div className="mt-0.5 p-1.5 bg-[#F3F0EA] rounded-lg">{notif.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#243447]">{notif.title}</p>
                      <p className="text-[11px] text-[#6B7280] truncate">{notif.desc}</p>
                      <span className="text-[10px] text-[#6B7280]/80 mt-1 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 px-4 border-t border-[#E5DED2] text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/app/activity');
                  }}
                  className="text-xs font-medium text-[#243447] hover:text-[#D8A48F] transition-colors"
                >
                  View full activity feed →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-[#F3F0EA] transition-colors"
          >
            <Avatar
              name={user?.name || 'User'}
              avatar={user?.avatar}
              status={user?.status || 'online'}
              size="sm"
            />
            <span className="hidden md:block text-xs font-semibold text-[#243447] max-w-[100px] truncate">
              {user?.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#FFFCF8] rounded-2xl shadow-floating border border-[#E5DED2] py-2 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-[#E5DED2] bg-[#F3F0EA]/40">
                <p className="text-sm font-bold text-[#243447] truncate">{user?.name}</p>
                <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
                <div className="mt-2 flex items-center justify-between">
                  <RoleBadge role={user?.role || 'Member'} />
                  <span className="text-[11px] text-[#6B7280]">{user?.title}</span>
                </div>
              </div>

              {/* Quick Switch Demo Accounts */}
              <div className="px-4 py-2 border-b border-[#E5DED2]">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] mb-1.5">
                  Quick Switch Persona
                </p>
                <div className="space-y-1">
                  {[
                    { name: 'Nishashree (Admin)', email: 'nishashree@teampulse.io' },
                    { name: 'Rahul (High Load)', email: 'rahul@teampulse.io' },
                    { name: 'Priya (Available)', email: 'priya@teampulse.io' },
                    { name: 'Karthik (Leader)', email: 'karthik@teampulse.io' },
                  ].map((demo) => (
                    <button
                      key={demo.email}
                      onClick={async () => {
                        setShowProfileMenu(false);
                        await demoLogin(demo.email);
                      }}
                      className={`w-full text-left px-2 py-1 rounded-lg text-xs flex items-center justify-between ${
                        user?.email === demo.email
                          ? 'bg-[#D8A48F]/20 text-[#243447] font-semibold'
                          : 'text-[#6B7280] hover:bg-[#F3F0EA]'
                      }`}
                    >
                      <span>{demo.name}</span>
                      {user?.email === demo.email && <UserCheck className="w-3.5 h-3.5 text-[#D8A48F]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
