import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  User,
  FolderKanban,
  Flag,
  CheckCircle2,
  Trash2,
  Edit3,
  Send,
  MessageSquare,
  Clock,
  Sparkles,
} from 'lucide-react';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';

export const TaskModal = () => {
  const { activeModal, modalData, closeModal, updateTask, deleteTask, addComment, projects, workloadData } = useAppData();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Form states for edit mode
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    priority: 'Medium',
    status: 'To Do',
    dueDate: '',
  });

  useEffect(() => {
    if (modalData) {
      setFormData({
        title: modalData.title || '',
        description: modalData.description || '',
        project: modalData.project?._id || modalData.project || '',
        assignedTo: modalData.assignedTo?._id || modalData.assignedTo || '',
        priority: modalData.priority || 'Medium',
        status: modalData.status || 'To Do',
        dueDate: modalData.dueDate ? new Date(modalData.dueDate).toISOString().split('T')[0] : '',
      });
      setIsEditing(false);
    }
  }, [modalData]);

  if (activeModal !== 'taskDetails' || !modalData) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTask(modalData._id, formData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickStatusChange = async (newStatus) => {
    try {
      await updateTask(modalData._id, { status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(modalData._id);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);
    try {
      await addComment(modalData._id, commentText.trim());
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No deadline';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = modalData.dueDate && new Date(modalData.dueDate) < new Date() && modalData.status !== 'Completed';

  return (
    <Modal
      isOpen={activeModal === 'taskDetails'}
      onClose={closeModal}
      title={isEditing ? 'Edit Task Details' : modalData.title}
      maxWidth="max-w-3xl"
    >
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#243447] mb-1">Task Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#243447] mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">Project</label>
              <select
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">Assignee</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
              >
                {workloadData.map((w) => (
                  <option key={w.user._id} value={w.user._id}>
                    {w.user.name} ({w.workloadStatus})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#243447] mb-1">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5DED2]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl border border-[#E5DED2] text-sm font-semibold text-[#243447] hover:bg-[#F3F0EA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#D8A48F] hover:bg-[#c99580] text-sm font-semibold text-[#243447]"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Top meta strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5DED2]">
            <div className="flex items-center space-x-2">
              <StatusBadge status={modalData.status} />
              <PriorityBadge priority={modalData.priority} />
              {isOverdue && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                  Overdue
                </span>
              )}
            </div>

            {/* Actions: Edit & Delete */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-[#E5DED2] text-xs font-semibold text-[#243447] hover:bg-[#F3F0EA] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Task Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-[#F3F0EA]/60 border border-[#E5DED2]">
            <div>
              <span className="text-[11px] font-medium text-[#6B7280] block mb-1">Project</span>
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#243447]">
                <FolderKanban className="w-4 h-4 text-[#D8A48F]" />
                <span>{modalData.project?.name || 'General Project'}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-[#6B7280] block mb-1">Assignee</span>
              <div className="flex items-center space-x-2">
                <Avatar
                  name={modalData.assignedTo?.name || 'Unassigned'}
                  avatar={modalData.assignedTo?.avatar}
                  size="xs"
                />
                <span className="text-xs font-semibold text-[#243447]">
                  {modalData.assignedTo?.name || 'Unassigned'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-[#6B7280] block mb-1">Due Date</span>
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#243447]">
                <CalendarIcon className="w-4 h-4 text-[#6B7280]" />
                <span className={isOverdue ? 'text-red-600 font-bold' : ''}>
                  {formatDate(modalData.dueDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">Description</h4>
            <div className="p-4 rounded-xl bg-[#FFFCF8] border border-[#E5DED2] text-sm text-[#243447] leading-relaxed whitespace-pre-wrap min-h-[70px]">
              {modalData.description || 'No detailed description provided.'}
            </div>
          </div>

          {/* Quick status mover bar */}
          <div className="p-3.5 rounded-xl bg-[#E7E1F5]/40 border border-[#D6BCFA]/60 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-[#243447] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D8A48F]" />
              Quick Move Status:
            </span>
            <div className="flex items-center space-x-1.5">
              {['To Do', 'In Progress', 'Review', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleQuickStatusChange(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    modalData.status === st
                      ? 'bg-[#243447] text-white shadow-sm'
                      : 'bg-white text-[#243447] border border-[#E5DED2] hover:bg-[#F3F0EA]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#D8A48F]" />
                Comments ({modalData.comments?.length || 0})
              </h4>
            </div>

            {/* Comment list */}
            <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
              {modalData.comments && modalData.comments.length > 0 ? (
                modalData.comments.map((comment, index) => (
                  <div
                    key={comment._id || index}
                    className="p-3 rounded-xl bg-[#F3F0EA]/50 border border-[#E5DED2] flex items-start space-x-3"
                  >
                    <Avatar
                      name={comment.user?.name || 'Teammate'}
                      avatar={comment.user?.avatar}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#243447]">
                          {comment.user?.name || 'Teammate'}
                        </span>
                        <span className="text-[10px] text-[#6B7280]">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </span>
                      </div>
                      <p className="text-xs text-[#243447] leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-[#E5DED2] text-center text-xs text-[#6B7280]">
                  No comments yet. Start the conversation below!
                </div>
              )}
            </div>

            {/* New comment input */}
            <form onSubmit={handleAddComment} className="flex items-center space-x-2">
              <Avatar name={user?.name || 'Me'} avatar={user?.avatar} size="sm" />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment or status update..."
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-[#FFFCF8] border border-[#E5DED2] rounded-xl text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmittingComment}
                className="p-2.5 rounded-xl bg-[#D8A48F] hover:bg-[#c99580] disabled:opacity-50 text-[#243447] transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TaskModal;
