import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Calendar, CheckSquare, ArrowRight, MoreVertical, Trash2 } from 'lucide-react';
import Avatar from '../common/Avatar';
import { StatusBadge } from '../common/Badge';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';

export const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const { deleteProject } = useAppData();
  const { user } = useAuth();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOwnerOrAdmin =
    user?.role === 'Admin' ||
    user?.role === 'Team Leader' ||
    (project.createdBy?._id || project.createdBy) === user?._id;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete project "${project.name}"? All associated tasks will also be removed.`)) {
      await deleteProject(project._id);
    }
  };

  return (
    <div
      onClick={() => navigate('/app/kanban')}
      className="pulse-card p-6 flex flex-col justify-between cursor-pointer group hover:border-[#D8A48F]"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#243447] shadow-sm font-bold"
              style={{ backgroundColor: `${project.color || '#D8A48F'}33`, border: `1px solid ${project.color || '#D8A48F'}` }}
            >
              <FolderKanban className="w-5 h-5 text-[#243447]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#243447] group-hover:text-[#D8A48F] transition-colors leading-tight">
                {project.name}
              </h3>
              <span className="text-[11px] text-[#6B7280]">
                Created {formatDate(project.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <StatusBadge status={project.status} />
            {isOwnerOrAdmin && (
              <button
                onClick={handleDelete}
                className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2 mb-4">
          {project.description || 'Collaborative team workspace project.'}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-[#6B7280]">Progress</span>
            <span className="font-bold text-[#243447]">{project.progress || 0}%</span>
          </div>
          <div className="w-full bg-[#E5DED2] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#A8C3A0] h-2 rounded-full transition-all duration-500"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-[#E5DED2] flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-[#6B7280]">
          <div className="flex items-center space-x-1">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{project.completedTasks || 0}/{project.totalTasks || 0} tasks</span>
          </div>

          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(project.deadline)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs font-semibold text-[#243447] group-hover:text-[#D8A48F]">
          <span>Board</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
