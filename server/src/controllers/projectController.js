const Project = require('../models/Project');
const Task = require('../models/Task');
const logActivity = require('../utils/activityLogger');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const projects = await Project.find(query)
      .populate('members', 'name email avatar role title')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    // Calculate task counts and completion percentage for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({ project: project._id });
        const completedTasks = await Task.countDocuments({
          project: project._id,
          status: 'Completed',
        });
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...project.toObject(),
          totalTasks,
          completedTasks,
          progress,
        };
      })
    );

    res.json({
      success: true,
      count: projectsWithProgress.length,
      data: projectsWithProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project with tasks
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email avatar role title status')
      .populate('createdBy', 'name email avatar');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email avatar role title')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name avatar')
      .sort({ order: 1, createdAt: -1 });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      data: {
        ...project.toObject(),
        totalTasks,
        completedTasks,
        progress,
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, deadline, members, status, color } = req.body;

    if (!name || !deadline) {
      return res.status(400).json({ success: false, message: 'Please provide project name and deadline' });
    }

    const memberList = members && members.length > 0 ? members : [req.user._id];

    const project = await Project.create({
      name,
      description,
      deadline,
      members: memberList,
      status: status || 'In Progress',
      color: color || '#D8A48F',
      createdBy: req.user._id,
    });

    await logActivity({
      userId: req.user._id,
      action: 'created_project',
      details: `${req.user.name} created project "${project.name}"`,
      projectId: project._id,
    });

    const populatedProject = await Project.findById(project._id)
      .populate('members', 'name email avatar role title')
      .populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      data: {
        ...populatedProject.toObject(),
        totalTasks: 0,
        completedTasks: 0,
        progress: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('members', 'name email avatar role title')
      .populate('createdBy', 'name email avatar');

    const totalTasks = await Task.countDocuments({ project: project._id });
    const completedTasks = await Task.countDocuments({
      project: project._id,
      status: 'Completed',
    });
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      data: {
        ...project.toObject(),
        totalTasks,
        completedTasks,
        progress,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Role check: Only Admin, Team Leader, or Project Creator can delete
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';
    const isLeader = req.user.role === 'Team Leader';

    if (!isCreator && !isAdmin && !isLeader) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    // Delete tasks belonging to this project
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project and associated tasks removed',
    });
  } catch (error) {
    next(error);
  }
};
