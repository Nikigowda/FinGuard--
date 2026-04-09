const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

// Dashboard is for ANALYST and ADMIN (VIEWERs only see raw records)
router.use(authenticate, requireRole('ANALYST', 'ADMIN'));

// GET /api/dashboard/summary
router.get('/summary', dashboardController.getSummary);

// GET /api/dashboard/trends/monthly?year=2025
router.get('/trends/monthly', dashboardController.getMonthlyTrends);

// GET /api/dashboard/trends/weekly
router.get('/trends/weekly', dashboardController.getWeeklyTrends);

module.exports = router;
