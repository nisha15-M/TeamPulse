const Activity = require('../models/Activity');

// @desc    Get team activity timeline
// @route   GET /api/activities
// @access  Private
exports.getActivities = async (req, res, next) => {
  try {
    const { limit = 25, project } = req.query;
    let query = {};

    if (project) {
      query.project = project;
    }

    const activities = await Activity.find(query)
      .populate('user', 'name email avatar role title')
      .populate('task', 'title priority status')
      .populate('project', 'name color')
      .populate('team', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};
