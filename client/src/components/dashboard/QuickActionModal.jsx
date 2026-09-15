import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';

export const QuickActionModal = () => {
  const { activeModal, closeModal, createTask, createProject, inviteMember, projects, workloadData, teams } = useAppData();
  const { user } = useAuth();

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    project: projects[0]?._id || '',
    assignedTo: user?._id || '',
    priority: 'Medium',
    status: 'To Do',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'In Progress',
    color: '#D8A48F',
  });

  // Member invite state
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'Member',
  });

  const [loading, setLoading] = useState(false);

  // Auto-set project default if empty
  if (activeModal === 'createTask' && !taskForm.project && projects.length > 0) {
    setTaskForm((prev) => ({ ...prev, project: projects[0]._id }));
  }

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTask(taskForm);
      setTaskForm({
        title: '',
        description: '',
        project: projects[0]?._id || '',
        assignedTo: user?._id || '',
        priority: 'Medium',
        status: 'To Do',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject(projectForm);
      setProjectForm({
        name: '',
        description: '',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'In Progress',
        color: '#D8A48F',
      });
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!teams[0]?._id) return;
    setLoading(true);
    try {
      await inviteMember(teams[0]._id, inviteForm);
      setInviteForm({ email: '', role: 'Member' });
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!['createTask', 'createProject', 'inviteMember'].includes(activeModal)) {
    return null;
  }

  return (
    <>
      {/* Create Task Modal */}
      <Modal
        isOpen={activeModal === 'createTask'}
        onClose={closeModal}
        title="Create New Task"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleTaskSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#243447] mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement OAuth login provider"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#243447] mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Add key deliverables, acceptance criteria, or technical links..."
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">Project</label>
              <select
                required
                value={taskForm.project}
                onChange={(e) => setTaskForm({ ...taskForm, project: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
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
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
              >
                {workloadData.map((w) => (
                  <option key={w.user._id} value={w.user._id}>
                    {w.user.name} ({w.assignedTasks} active • {w.workloadStatus})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">Priority</label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">Initial Status</label>
              <select
                value={taskForm.status}
                onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#243447] mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5DED2]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl border border-[#E5DED2] text-sm font-semibold text-[#243447] hover:bg-[#F3F0EA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#D8A48F] hover:bg-[#c99580] text-sm font-semibold text-[#243447] disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Project Modal */}
      <Modal
        isOpen={activeModal === 'createProject'}
        onClose={closeModal}
        title="Create New Project"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleProjectSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#243447] mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Smart Energy Grid Capstone"
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#243447] mb-1">Project Scope & Summary</label>
            <textarea
              rows={3}
              placeholder="Brief description of the project goals and deliverables..."
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">
                Project Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={projectForm.deadline}
                onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">Status</label>
              <select
                value={projectForm.status}
                onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#243447] mb-1">Theme Accent Color</label>
              <div className="flex items-center space-x-3">
                {['#D8A48F', '#A8C3A0', '#E7E1F5', '#243447', '#F0C987'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setProjectForm({ ...projectForm, color: c })}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      projectForm.color === c ? 'scale-110 border-[#243447] shadow-md' : 'border-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5DED2]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl border border-[#E5DED2] text-sm font-semibold text-[#243447] hover:bg-[#F3F0EA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#D8A48F] hover:bg-[#c99580] text-sm font-semibold text-[#243447] disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        isOpen={activeModal === 'inviteMember'}
        onClose={closeModal}
        title="Invite Team Member"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <p className="text-xs text-[#6B7280]">
            Invite a classmate, colleague, or advisor to your project workspace.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#243447] mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. colleague@university.edu"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#243447] mb-1">Role in Team</label>
            <select
              value={inviteForm.role}
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
            >
              <option value="Member">Member (Developer / Contributor)</option>
              <option value="Team Leader">Team Leader (Project Coordinator)</option>
              <option value="Admin">Admin (Workspace Owner)</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5DED2]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl border border-[#E5DED2] text-sm font-semibold text-[#243447] hover:bg-[#F3F0EA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#D8A48F] hover:bg-[#c99580] text-sm font-semibold text-[#243447] disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default QuickActionModal;
