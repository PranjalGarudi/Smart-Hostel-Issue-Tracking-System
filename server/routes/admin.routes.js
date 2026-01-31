const express = require('express');
const router = express.Router();
const pool = require('../db');
const role = require('../middleware/roleMiddleware');

/**
 * =========================
 * ADMIN DASHBOARD OVERVIEW
 * =========================
 */
router.get('/stats', role('admin'), async (req, res) => {
  try {
    const totalIssues = await pool.query(
      'SELECT COUNT(*) FROM issues'
    );

    const openIssues = await pool.query(
      "SELECT COUNT(*) FROM issues WHERE status IN ('Reported', 'Verified', 'Assigned', 'In Progress')"
    );

    const resolvedIssues = await pool.query(
      "SELECT COUNT(*) FROM issues WHERE status = 'Resolved'"
    );

    res.json({
      total: totalIssues.rows[0].count,
      open: openIssues.rows[0].count,
      resolved: resolvedIssues.rows[0].count
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

/**
 * =========================
 * MANAGE USERS
 * =========================
 */
router.get('/users', role('admin'), async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, name, email, role FROM users ORDER BY role'
    );
    res.json(users.rows);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * Update user role
 */
router.put('/users/:id/role', role('admin'), async (req, res) => {
  try {
    const { role: newRole } = req.body;
    const { id } = req.params;

    await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2',
      [newRole, id]
    );

    res.json({ message: "User role updated" });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ error: "Failed to update role" });
  }
});

/**
 * =========================
 * ANNOUNCEMENTS
 * =========================
 */
router.post('/announcements', role('admin'), async (req, res) => {
  try {
    const { title, message, priority } = req.body;

    const result = await pool.query(
      `INSERT INTO announcements (title, message, priority)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, message, priority]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create announcement error:", err);
    res.status(500).json({ error: "Failed to create announcement" });
  }
});

router.get('/announcements', async (req, res) => {
  try {
    const announcements = await pool.query(
      'SELECT * FROM announcements ORDER BY created_at DESC'
    );
    res.json(announcements.rows);
  } catch (err) {
    console.error("Get announcements error:", err);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

/**
 * =========================
 * AUDIT LOGS (READ-ONLY)
 * =========================
 */
router.get('/audit-logs', role('admin'), async (req, res) => {
  try {
    const logs = await pool.query(
      'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100'
    );
    res.json(logs.rows);
  } catch (err) {
    console.error("Audit log error:", err);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

module.exports = router;
