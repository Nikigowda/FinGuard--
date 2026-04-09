const dashboardService = require('../services/dashboard.service');

async function getSummary(req, res, next) {
  try {
    const data = await dashboardService.getSummary();
    return res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getMonthlyTrends(req, res, next) {
  try {
    const data = await dashboardService.getMonthlyTrends(req.query.year);
    return res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getWeeklyTrends(req, res, next) {
  try {
    const data = await dashboardService.getWeeklyTrends();
    return res.json({ data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary, getMonthlyTrends, getWeeklyTrends };
