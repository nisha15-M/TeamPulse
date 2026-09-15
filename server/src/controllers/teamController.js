const Team = require('../models/Team');
const User = require('../models/User');
const Task = require('../models/Task');
const logActivity = require('../utils/activityLogger');

// @desc    Get all teams for user
// @route   GET /api/teams
// @access  Private
exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find()
      .populate('owner', 'name email avatar role title status')
      .populate('members.user', 'name email avatar role title status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
exports.getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('owner', 'name email avatar role title status')
      .populate('members.user', 'name email avatar role title status');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new team
// @route   POST /api/teams
// @access  Private
exports.createTeam = async (req, res, next) => {
  try {
    const { name, description, memberIds } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Team name is required' });
    }

    const members = [
      {
        user: req.user._id,
        role: req.user.role === 'Admin' ? 'Admin' : 'Team Leader',
      },
    ];

    if (memberIds && Array.isArray(memberIds)) {
      memberIds.forEach((mId) => {
        if (mId.toString() !== req.user._id.toString()) {
          members.push({ user: mId, role: 'Member' });
        }
      });
    }

    const team = await Team.create({
      name,
      description,
      owner: req.user._id,
      members,
    });

    await logActivity({
      userId: req.user._id,
      action: 'created_team',
      details: `${req.user.name} created team "${team.name}"`,
      teamId: team._id,
    });

    const populatedTeam = await Team.findById(team._id)
      .populate('owner', 'name email avatar role title status')
      .populate('members.user', 'name email avatar role title status');

    res.status(201).json({
      success: true,
      data: populatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite / Add member to team
// @route   POST /api/teams/:id/members
// @access  Private
exports.inviteMember = async (req, res, next) => {
  try {
    const { email, userId, role = 'Member' } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    let targetUser;
    if (userId) {
      targetUser = await User.findById(userId);
    } else if (email) {
      targetUser = await User.findOne({ email });
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found to add' });
    }

    const isAlreadyMember = team.members.some(
      (m) => m.user.toString() === targetUser._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ success: false, message: 'User is already a member of this team' });
    }

    team.members.push({
      user: targetUser._id,
      role,
      joinedAt: new Date(),
    });

    await team.save();

    await logActivity({
      userId: req.user._id,
      action: 'joined_team',
      details: `${targetUser.name} was added to ${team.name}`,
      teamId: team._id,
    });

    const updatedTeam = await Team.findById(team._id)
      .populate('owner', 'name email avatar role title status')
      .populate('members.user', 'name email avatar role title status');

    res.json({
      success: true,
      message: `${targetUser.name} added to team`,
      data: updatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private
exports.removeMember = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Role check: Admin, owner, or Team Leader can remove
    const isOwner = team.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';
    const isLeader = req.user.role === 'Team Leader';

    if (!isOwner && !isAdmin && !isLeader) {
      return res.status(403).json({ success: false, message: 'Not authorized to remove team members' });
    }

    team.members = team.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );

    await team.save();

    res.json({
      success: true,
      message: 'Member removed from team',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get workload balance analysis for team members
// @route   GET /api/teams/workload
// @access  Private
exports.getWorkloadBalance = async (req, res, next) => {
  try {
    // Get all users
    const users = await User.find().select('name email avatar role title status');

    // Get all active tasks
    const activeTasks = await Task.find({ status: { $ne: 'Completed' } });
    const completedTasks = await Task.find({ status: 'Completed' });

    const workloadData = users.map((user) => {
      const userActiveTasks = activeTasks.filter(
        (t) => t.assignedTo && t.assignedTo.toString() === user._id.toString()
      );
      const userCompletedTasks = completedTasks.filter(
        (t) => t.assignedTo && t.assignedTo.toString() === user._id.toString()
      );

      const assignedCount = userActiveTasks.length;
      let workloadStatus = 'Balanced';
      let capacityPercent = Math.min(Math.round((assignedCount / 8) * 100), 100);

      if (assignedCount >= 7) {
        workloadStatus = 'High';
      } else if (assignedCount <= 3) {
        workloadStatus = 'Available';
      } else {
        workloadStatus = 'Balanced';
      }

      return {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          title: user.title,
          status: user.status,
        },
        assignedTasks: assignedCount,
        completedTasks: userCompletedTasks.length,
        workloadStatus,
        capacityPercent,
        tasks: userActiveTasks.map((t) => ({
          _id: t._id,
          title: t.title,
          priority: t.priority,
          status: t.status,
          dueDate: t.dueDate,
        })),
      };
    });

    res.json({
      success: true,
      data: workloadData,
    });
  } catch (error) {
    next(error);
  }
};
