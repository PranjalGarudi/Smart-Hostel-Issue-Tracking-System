const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const auth = require('./server/middleware/authMiddleware');

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== FRONTEND =====
app.use(express.static(path.join(__dirname, 'client')));

// ===== ROUTES =====
app.use('/api/auth', require('./server/routes/auth.routes'));
app.use('/api/issues', auth, require('./server/routes/issue.routes'));
app.use('/api/admin', auth, require('./server/routes/admin.routes'));

// ===== DEFAULT PAGE =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'login.html'));
});

// ===== START SERVER =====
app.listen(process.env.PORT || 5050, () => {
  console.log(`Server running on port ${process.env.PORT || 5050}`);
});
