const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get aggregated analytics & project insights
// @route   GET /api/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
    const reviewTasks = await Task.countDocuments({ status: 'Review' });
    const todoTasks = await Task.countDocuments({ status: 'To Do' });
    const pendingTasks = totalTasks - completedTasks;

    // Status distribution
    const statusData = [
      { name: 'To Do', count: todoTasks, color: '#B4A5D9' },
      { name: 'In Progress', count: inProgressTasks, color: '#D8A48F' },
      { name: 'Review', count: reviewTasks, color: '#F0C987' },
      { name: 'Completed', count: completedTasks, color: '#A8C3A0' },
    ];

    // Priority distribution
    const lowPriority = await Task.countDocuments({ priority: 'Low' });
    const mediumPriority = await Task.countDocuments({ priority: 'Medium' });
    const highPriority = await Task.countDocuments({ priority: 'High' });
    const urgentPriority = await Task.countDocuments({ priority: 'Urgent' });

    const priorityData = [
      { priority: 'Low', count: lowPriority, color: '#A8C3A0' },
      { priority: 'Medium', count: mediumPriority, color: '#F0C987' },
      { priority: 'High', count: highPriority, color: '#D8A48F' },
      { priority: 'Urgent', count: urgentPriority, color: '#E07A5F' },
    ];

    // Projects progress summary
    const projects = await Project.find().select('name status deadline');
    const projectProgressData = await Promise.all(
      projects.map(async (p) => {
        const pTotal = await Task.countDocuments({ project: p._id });
        const pCompleted = await Task.countDocuments({ project: p._id, status: 'Completed' });
        const percent = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;
        return {
          name: p.name,
          total: pTotal,
          completed: pCompleted,
          progress: percent,
        };
      })
    );

    // Team members workload comparison
    const users = await User.find().select('name email role avatar');
    const workloadData = await Promise.all(
      users.map(async (u) => {
        const assigned = await Task.countDocuments({ assignedTo: u._id, status: { $ne: 'Completed' } });
        const done = await Task.countDocuments({ assignedTo: u._id, status: 'Completed' });
        return {
          name: u.name,
          activeTasks: assigned,
          completedTasks: done,
        };
      })
    );

    // Weekly productivity dummy or aggregated by date
    const weeklyData = [
      { day: 'Mon', completed: 4, created: 6 },
      { day: 'Tue', completed: 7, created: 5 },
      { day: 'Wed', completed: 9, created: 8 },
      { day: 'Thu', completed: 6, created: 4 },
      { day: 'Fri', completed: 11, created: 7 },
      { day: 'Sat', completed: 5, created: 2 },
      { day: 'Sun', completed: 3, created: 1 },
    ];

    res.json({
      success: true,
      data: {
        summary: {
          totalTasks,
          completedTasks,
          pendingTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
        statusData,
        priorityData,
        projectProgressData,
        workloadData,
        weeklyData,
      },
    });
  } catch (error) {
    next(error);
  }
};
