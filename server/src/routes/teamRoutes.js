const express = require('express');
const router = express.Router();
const {
  getTeams,
  getTeamById,
  createTeam,
  inviteMember,
  removeMember,
  getWorkloadBalance,
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getTeams);
router.post('/', createTeam);
router.get('/workload', getWorkloadBalance);
router.get('/:id', getTeamById);
router.post('/:id/members', inviteMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
