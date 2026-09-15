const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');
const logActivity = require('../utils/activityLogger');

// @desc    Get tasks with filtering & sorting
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const {
      project,
      status,
      priority,
      assignedTo,
      myTasks,
      search,
      sortBy = 'dueDate',
      sortOrder = 'asc',
    } = req.query;

    let query = {};

    if (project && project !== 'All') {
      query.project = project;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (myTasks === 'true') {
      query.assignedTo = req.user._id;
    } else if (assignedTo && assignedTo !== 'All') {
      query.assignedTo = assignedTo;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(query)
      .populate('project', 'name color deadline')
      .populate('assignedTo', 'name email avatar role title')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar role')
      .sort(sortOptions);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name color deadline')
      .populate('assignedTo', 'name email avatar role title')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar role');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, priority, status, dueDate, team } = req.body;

    if (!title || !project || !dueDate) {
      return res.status(400).json({ success: false, message: 'Title, project, and due date are required' });
    }

    const task = await Task.create({
      title,
      description,
      project,
      team,
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id,
      priority: priority || 'Medium',
      status: status || 'To Do',
      dueDate,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name color deadline')
      .populate('assignedTo', 'name email avatar role title')
      .populate('createdBy', 'name email avatar');

    const assigneeName = populatedTask.assignedTo ? populatedTask.assignedTo.name : 'unassigned';
    await logActivity({
      userId: req.user._id,
      action: 'created_task',
      details: `${req.user.name} created task "${task.title}" (assigned to ${assigneeName})`,
      taskId: task._id,
      projectId: project,
    });

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task (including status for Kanban drag-drop)
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const previousStatus = task.status;
    const { title, description, project, assignedTo, priority, status, dueDate, order } = req.body;

    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.project = project !== undefined ? project : task.project;
    task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
    task.priority = priority !== undefined ? priority : task.priority;
    task.status = status !== undefined ? status : task.status;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.order = order !== undefined ? order : task.order;

    await task.save();

    // Check if status changed
    if (status && status !== previousStatus) {
      const actionType = status === 'Completed' ? 'completed_task' : 'updated_task';
      await logActivity({
        userId: req.user._id,
        action: actionType,
        details: `${req.user.name} moved "${task.title}" to ${status}`,
        taskId: task._id,
        projectId: task.project,
      });
    }

    const updatedTask = await Task.findById(task._id)
      .populate('project', 'name color deadline')
      .populate('assignedTo', 'name email avatar role title')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar role');

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const taskTitle = task.title;
    const projectId = task.project;

    await task.deleteOne();

    await logActivity({
      userId: req.user._id,
      action: 'deleted_task',
      details: `${req.user.name} deleted task "${taskTitle}"`,
      projectId,
    });

    res.json({
      success: true,
      message: 'Task removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const newComment = {
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    };

    task.comments.push(newComment);
    await task.save();

    await logActivity({
      userId: req.user._id,
      action: 'commented_task',
      details: `${req.user.name} commented on "${task.title}": "${text.trim().substring(0, 40)}${text.length > 40 ? '...' : ''}"`,
      taskId: task._id,
      projectId: task.project,
    });

    const updatedTask = await Task.findById(task._id)
      .populate('project', 'name color deadline')
      .populate('assignedTo', 'name email avatar role title')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar role');

    res.status(201).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};
