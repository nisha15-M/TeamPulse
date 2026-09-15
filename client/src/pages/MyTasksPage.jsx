import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  CheckSquare,
  AlertCircle,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/tasks/TaskCard';

export const MyTasksPage = () => {
  const { tasks, projects, openModal } = useAppData();
  const { user } = useAuth();

  const [assignedOnly, setAssignedOnly] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedProject, setSelectedProject] = useState('All');
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline' or 'priority'
  const [searchTerm, setSearchTerm] = useState('');

  const priorityWeights = { Urgent: 4, High: 3, Medium: 2, Low: 1 };

  // Filter tasks
  const filteredTasks = tasks
    .filter((t) => {
      if (assignedOnly && user) {
        const assigneeId = t.assignedTo?._id || t.assignedTo;
        if (assigneeId !== user._id) return false;
      }
      if (selectedStatus !== 'All' && t.status !== selectedStatus) return false;
      if (selectedPriority !== 'All' && t.priority !== selectedPriority) return false;
      if (selectedProject !== 'All') {
        const projId = t.project?._id || t.project;
        if (projId !== selectedProject) return false;
      }
      if (searchTerm) {
        const matchesTitle = t.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDesc = t.description?.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'priority') {
        return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
      }
      return 0;
    });

  const overdueCount = filteredTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pulse-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#243447]">My Tasks</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E7E1F5] text-[#243447]">
              {filteredTasks.length} tasks
            </span>
            {overdueCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {overdueCount} overdue
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B7280]">
            Review your personal queue, deliverables, and priority action items
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Assigned Only Toggle */}
          <div className="bg-[#F3F0EA] p-1 rounded-xl flex items-center border border-[#E5DED2]">
            <button
              onClick={() => setAssignedOnly(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                assignedOnly
                  ? 'bg-[#FFFCF8] text-[#243447] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#243447]'
              }`}
            >
              Assigned to Me
            </button>
            <button
              onClick={() => setAssignedOnly(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !assignedOnly
                  ? 'bg-[#FFFCF8] text-[#243447] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#243447]'
              }`}
            >
              All Workspace Tasks
            </button>
          </div>

          <button
            onClick={() => openModal('createTask')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#D8A48F] hover:bg-[#c99580] text-xs sm:text-sm font-semibold text-[#243447] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="pulse-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl border border-[#E5DED2] bg-[#F3F0EA] text-xs sm:text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E5DED2] bg-[#F3F0EA] text-xs sm:text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
          >
            <option value="All">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E5DED2] bg-[#F3F0EA] text-xs sm:text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E5DED2] bg-[#F3F0EA] text-xs sm:text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-[#6B7280]" />
          <span className="text-xs text-[#6B7280]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E5DED2] bg-[#F3F0EA] text-xs sm:text-sm font-semibold text-[#243447] focus:outline-none focus:border-[#D8A48F]"
          >
            <option value="deadline">Earliest Deadline</option>
            <option value="priority">Highest Priority</option>
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="pulse-card py-16 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E7E1F5] flex items-center justify-center mx-auto mb-4 text-[#243447]">
            <CheckCircle2 className="w-7 h-7 text-[#243447]" />
          </div>
          <h3 className="text-base font-bold text-[#243447] mb-1">No matching tasks found</h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto mb-5">
            You're either all caught up, or no tasks match the current filter criteria.
          </p>
          <button
            onClick={() => openModal('createTask')}
            className="px-4 py-2 rounded-xl bg-[#D8A48F] text-[#243447] text-xs sm:text-sm font-bold shadow-sm"
          >
            Create a New Task
          </button>
        </div>
      )}
    </div>
  );
};

export default MyTasksPage;
