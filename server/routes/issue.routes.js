const express = require('express');
const router = express.Router();
const controller = require('../controllers/issue.controller');
const role = require('../middleware/roleMiddleware');

// Student
router.post('/', role('student'), controller.createIssue);

// All roles (filtered inside controller)
router.get('/', controller.getIssues);

// Warden
router.put('/:id/verify', role('warden'), controller.verifyIssue);

// Maintenance / Security
router.put('/:id/start', role('maintenance', 'security'), controller.startIssue);
router.put('/:id/resolve', role('maintenance', 'security'), controller.resolveIssue);

// Student / Admin
router.put('/:id/reopen', role('student', 'admin'), controller.reopenIssue);

module.exports = router;
