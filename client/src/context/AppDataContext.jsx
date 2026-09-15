import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [workloadData, setWorkloadData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Toast state
  const [toast, setToast] = useState(null);

  // Active modal state
  const [activeModal, setActiveModal] = useState(null); // 'taskDetails', 'createTask', 'createProject', 'inviteMember', 'editProject'
  const [modalData, setModalData] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  const openModal = useCallback((modalType, data = null) => {
    setActiveModal(modalType);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  const fetchTasks = useCallback(async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/tasks${query ? `?${query}` : ''}`);
      if (res.success) {
        setTasks(res.data);
      }
      return res.data;
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  }, []);

  const fetchProjects = useCallback(async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/projects${query ? `?${query}` : ''}`);
      if (res.success) {
        setProjects(res.data);
      }
      return res.data;
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  }, []);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await api.get('/teams');
      if (res.success) {
        setTeams(res.data);
      }
      return res.data;
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    }
  }, []);

  const fetchWorkload = useCallback(async () => {
    try {
      const res = await api.get('/teams/workload');
      if (res.success) {
        setWorkloadData(res.data);
      }
      return res.data;
    } catch (err) {
      console.error('Failed to fetch workload:', err);
    }
  }, []);

  const fetchActivities = useCallback(async (limit = 20) => {
    try {
      const res = await api.get(`/activities?limit=${limit}`);
      if (res.success) {
        setActivities(res.data);
      }
      return res.data;
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    await Promise.all([
      fetchTasks(),
      fetchProjects(),
      fetchTeams(),
      fetchWorkload(),
      fetchActivities(),
    ]);
    setLoading(false);
  }, [isAuthenticated, fetchTasks, fetchProjects, fetchTeams, fetchWorkload, fetchActivities]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAll();
    }
  }, [isAuthenticated, refreshAll]);

  // Task actions
  const createTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      if (res.success) {
        showToast('Task created successfully!');
        await refreshAll();
        return res.data;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateTask = async (id, updateData) => {
    try {
      const res = await api.put(`/tasks/${id}`, updateData);
      if (res.success) {
        // Optimistically update tasks list
        setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
        if (modalData && modalData._id === id) {
          setModalData(res.data);
        }
        await Promise.all([fetchWorkload(), fetchActivities(10), fetchProjects()]);
        return res.data;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await api.delete(`/tasks/${id}`);
      if (res.success) {
        showToast('Task removed');
        setTasks((prev) => prev.filter((t) => t._id !== id));
        if (activeModal === 'taskDetails' && modalData?._id === id) {
          closeModal();
        }
        await Promise.all([fetchWorkload(), fetchActivities(10), fetchProjects()]);
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const addComment = async (taskId, text) => {
    try {
      const res = await api.post(`/tasks/${taskId}/comments`, { text });
      if (res.success) {
        showToast('Comment added');
        setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
        if (modalData && modalData._id === taskId) {
          setModalData(res.data);
        }
        await fetchActivities(10);
        return res.data;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Project actions
  const createProject = async (projectData) => {
    try {
      const res = await api.post('/projects', projectData);
      if (res.success) {
        showToast('Project created successfully!');
        await refreshAll();
        return res.data;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const res = await api.put(`/projects/${id}`, projectData);
      if (res.success) {
        showToast('Project updated');
        await refreshAll();
        return res.data;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.success) {
        showToast('Project deleted');
        await refreshAll();
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Team actions
  const inviteMember = async (teamId, memberData) => {
    try {
      const res = await api.post(`/teams/${teamId}/members`, memberData);
      if (res.success) {
        showToast(res.message || 'Member added to team!');
        await refreshAll();
        return res.data;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const removeMember = async (teamId, userId) => {
    try {
      const res = await api.delete(`/teams/${teamId}/members/${userId}`);
      if (res.success) {
        showToast('Member removed from team');
        await refreshAll();
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        tasks,
        projects,
        teams,
        workloadData,
        activities,
        loading,
        globalSearch,
        setGlobalSearch,
        toast,
        showToast,
        activeModal,
        modalData,
        openModal,
        closeModal,
        refreshAll,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        addComment,
        createProject,
        updateProject,
        deleteProject,
        inviteMember,
        removeMember,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
