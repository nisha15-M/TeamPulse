const Activity = require('../models/Activity');

const logActivity = async ({ userId, action, details, taskId = null, projectId = null, teamId = null }) => {
  try {
    const activity = await Activity.create({
      user: userId,
      action,
      details,
      task: taskId,
      project: projectId,
      team: teamId,
    });
    return activity;
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

module.exports = logActivity;
