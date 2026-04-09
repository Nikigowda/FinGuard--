const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'refreshToken is required' });
    }
    const result = await authService.refreshAccessToken(refreshToken);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = { register, login, refresh, me };
