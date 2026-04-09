require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const recordsRoutes = require('./routes/records.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ─── Serve Frontend Static Files ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../public')));

// ─── Catch-all: serve index.html for any non-API route ────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${new Date().toISOString()}] ${err.stack}`);
  }
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
