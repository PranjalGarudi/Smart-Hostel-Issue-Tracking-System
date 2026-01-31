# 🏫 Smart Hostel Issue Tracking System

Smart Hostel Issue Tracking System is a full-stack, role-based web application built to modernize and digitize hostel complaint management.  
It replaces informal reporting methods like WhatsApp messages and physical registers with a structured, transparent, and accountable system.

---

## 🚀 Features

### 👤 Role-Based Access Control
- **Student**: Report issues and track their status
- **Warden**: Verify or reject reported issues
- **Maintenance / Security Staff**: Start and resolve assigned issues
- **Admin**: Audit all issues and system activity

### 🛠 Issue Management
- Categorized issue reporting (Plumbing, Electrical, Internet, Cleanliness, Security, Emergency, etc.)
- Priority levels (Low, Medium, High, Emergency)
- Location tagging (Hostel / Block / Room)
- Defined issue lifecycle:
Reported → Verified → In Progress → Resolved

### 📊 Dashboard & Analytics
- Summary cards (Total, Open, Resolved issues)
- Role-specific dashboards
- Status badges and category icons for clarity

### 🔐 Security
- JWT-based authentication
- Protected API routes
- Role-restricted access using middleware

---

## 🧱 Tech Stack

### Frontend
- HTML
- CSS
- Vanilla JavaScript

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### Authentication
- JSON Web Tokens (JWT)

### Deployment
- Render (Web Service + PostgreSQL)

---
## 🚧 Work in Progress

This project is actively being developed. The following enhancements are currently planned or in progress:

- Issue assignment automation based on staff availability
- SLA and resolution time tracking
- Admin analytics dashboard for recurring issues
- Email and notification system
- Improved UI animations and accessibility
