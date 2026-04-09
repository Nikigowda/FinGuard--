/**
 * Role hierarchy:
 *   VIEWER   → read-only on records and dashboard
 *   ANALYST  → read + dashboard summaries
 *   ADMIN    → full access: manage users and records
 *
 * Usage: requireRole('ADMIN') or requireRole('ANALYST', 'ADMIN')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
}

module.exports = { requireRole };
