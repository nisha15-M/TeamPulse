import React, { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { useAppData } from '../../context/AppDataContext';
import { Filter, Search, Plus, FolderKanban } from 'lucide-react';

export const KanbanBoard = () => {
  const { tasks, projects, updateTask, openModal } = useAppData();

  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Drag & Drop Status Update
  const handleDropTask = async (taskId, newStatus) => {
    const task = tasks.find((t) => t._id === taskId);
    if (task && task.status !== newStatus) {
      await updateTask(taskId, { status: newStatus });
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesProject =
      selectedProject === 'All' ||
      (t.project?._id || t.project) === selectedProject;
    const matchesPriority =
      selectedPriority === 'All' || t.priority === selectedPriority;
    const matchesSearch =
      !searchTerm ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesProject && matchesPriority && matchesSearch;
  });

  const columns = [
    {
      status: 'To Do',
      title: 'To Do',
      tintClass: 'bg-[#EFEBF8]/50',
      headerColor: 'bg-[#B4A5D9]',
    },
    {
      status: 'In Progress',
      title: 'In Progress',
      tintClass: 'bg-[#FDF0E9]/50',
      headerColor: 'bg-[#D8A48F]',
    },
    {
      status: 'Review',
      title: 'Review',
      tintClass: 'bg-[#FAF5E8]/50',
      headerColor: 'bg-[#F0C987]',
    },
    {
      status: 'Completed',
      title: 'Completed',
      tintClass: 'bg-[#EDF5EB]/50',
      headerColor: 'bg-[#A8C3A0]',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFFCF8] border border-[#E5DED2] shadow-subtle">
        <div className="flex flex-wrap items-center gap-3">
          {/* Project Filter */}
          <div className="flex items-center space-x-2">
            <FolderKanban className="w-4 h-4 text-[#D8A48F]" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E5DED2] bg-[#F3F0EA] text-xs sm:text-sm font-medium text-[#243447] focus:outline-none focus:border-[#D8A48F]"
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#6B7280]" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E5DED2] bg-[#F3F0EA] text-xs sm:text-sm font-medium text-[#243447] focus:outline-none focus:border-[#D8A48F]"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search board tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl border border-[#E5DED2] bg-[#F3F0EA] text-xs sm:text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
            />
          </div>
        </div>

        {/* Add Task CTA */}
        <button
          onClick={() => openModal('createTask')}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#D8A48F] hover:bg-[#c99580] text-xs sm:text-sm font-semibold text-[#243447] shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* 4-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);
          return (
            <KanbanColumn
              key={col.status}
              status={col.status}
              title={col.title}
              tasks={colTasks}
              tintClass={col.tintClass}
              headerColor={col.headerColor}
              onDropTask={handleDropTask}
            />
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
