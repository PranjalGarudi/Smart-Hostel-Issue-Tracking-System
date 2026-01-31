CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  role TEXT,
  email TEXT UNIQUE
);

CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  category TEXT,
  priority TEXT,
  location TEXT,
  description TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title TEXT,
  message TEXT,
  priority TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  action TEXT,
  performed_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE users ADD COLUMN password TEXT;
