const pool = require('../db');

/**
 * STUDENT: Report a new issue
 */
exports.createIssue = async (req, res) => {
  try {
    const {
      category,
      priority,
      location,
      description,
      anonymous = false
    } = req.body;

    const reportedBy = anonymous ? null : req.user.id;

    const result = await pool.query(
      `INSERT INTO issues 
        (category, priority, location, description, status, reported_by, anonymous)
       VALUES ($1, $2, $3, $4, 'Reported', $5, $6)
       RETURNING *`,
      [category, priority, location, description, reportedBy, anonymous]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create issue error:", err);
    res.status(500).json({ error: "Failed to create issue" });
  }
};

/**
 * COMMON: Get issues (role-based filtering happens in route/middleware)
 */
exports.getIssues = async (req, res) => {
  try {
    let query = `SELECT * FROM issues ORDER BY created_at DESC`;
    let values = [];

    // Student sees only their issues
    if (req.user.role === 'student') {
      query = `SELECT * FROM issues WHERE reported_by = $1`;
      values = [req.user.id];
    }

    // Warden sees only reported (unverified) issues
    if (req.user.role === 'warden') {
      query = `SELECT * FROM issues WHERE status = 'Reported'`;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Get issues error:", err);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
};

/**
 * WARDEN: Verify issue
 */
exports.verifyIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await pool.query(
      `UPDATE issues
       SET status = 'Verified', verified_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    // 🔁 Auto-assign after verification
    await autoAssignIssue(issue.rows[0]);

    res.json({ message: "Issue verified", issue: issue.rows[0] });
  } catch (err) {
    console.error("Verify issue error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
};

/**
 * STAFF: Start work on issue
 */
exports.startIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE issues
       SET status = 'In Progress', started_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Start issue error:", err);
    res.status(500).json({ error: "Could not start issue" });
  }
};

/**
 * STAFF: Resolve issue
 */
exports.resolveIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE issues
       SET status = 'Resolved', resolved_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Resolve issue error:", err);
    res.status(500).json({ error: "Resolution failed" });
  }
};

/**
 * STUDENT / ADMIN: Reopen issue
 */
exports.reopenIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE issues
       SET status = 'Reopened'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Reopen issue error:", err);
    res.status(500).json({ error: "Reopen failed" });
  }
};

/**
 * 🔥 AUTO ASSIGNMENT LOGIC (CORE FEATURE)
 */
async function autoAssignIssue(issue) {
  try {
    // Simple mapping (extend later)
    const roleMap = {
      Plumbing: 'maintenance',
      Electrical: 'maintenance',
      Internet: 'maintenance',
      Cleanliness: 'maintenance',
      Security: 'security',
      Emergency: 'security'
    };

    const staffRole = roleMap[issue.category];
    if (!staffRole) return;

    // Find least busy staff
    const staff = await pool.query(
      `
      SELECT u.id
      FROM users u
      LEFT JOIN issues i ON u.id = i.assigned_to AND i.status IN ('Assigned', 'In Progress')
      WHERE u.role = $1
      GROUP BY u.id
      ORDER BY COUNT(i.id) ASC
      LIMIT 1
      `,
      [staffRole]
    );

    if (staff.rows.length === 0) return;

    await pool.query(
      `UPDATE issues
       SET assigned_to = $1, status = 'Assigned'
       WHERE id = $2`,
      [staff.rows[0].id, issue.id]
    );

  } catch (err) {
    console.error("Auto-assign error:", err);
  }
}
