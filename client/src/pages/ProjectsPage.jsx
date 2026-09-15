import React, { useState } from 'react';
import { Plus, Search, FolderKanban, Filter } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import ProjectCard from '../components/projects/ProjectCard';

export const ProjectsPage = () => {
  const { projects, openModal } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pulse-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#243447]">Projects</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E7E1F5] text-[#243447]">
              {projects.length} active
            </span>
          </div>
          <p className="text-xs text-[#6B7280]">
            Track capstone initiatives, startup sprints, and milestone target dates
          </p>
        </div>

        <button
          onClick={() => openModal('createProject')}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#D8A48F] hover:bg-[#c99580] text-xs sm:text-sm font-semibold text-[#243447] shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="pulse-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl border border-[#E5DED2] bg-[#F3F0EA] text-xs sm:text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#6B7280]" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E5DED2] bg-[#F3F0EA] text-xs sm:text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-[#6B7280]">
          Showing {filteredProjects.length} of {projects.length} projects
        </span>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="pulse-card py-16 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E7E1F5] flex items-center justify-center mx-auto mb-4 text-[#243447]">
            <FolderKanban className="w-7 h-7 text-[#243447]" />
          </div>
          <h3 className="text-base font-bold text-[#243447] mb-1">No projects match your filter</h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto mb-5">
            Try adjusting your search criteria or create a brand new team project.
          </p>
          <button
            onClick={() => openModal('createProject')}
            className="px-4 py-2 rounded-xl bg-[#D8A48F] text-[#243447] text-xs sm:text-sm font-bold shadow-sm"
          >
            Create New Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
