const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const SALT_ROUNDS = 12;

function signAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

async function register({ name, email, password, role }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: role ?? 'VIEWER' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return user;
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isActive) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

async function refreshAccessToken(refreshToken) {
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user || !user.isActive) {
    const err = new Error('User not found or inactive');
    err.statusCode = 401;
    throw err;
  }

  return { accessToken: signAccessToken(user) };
}

module.exports = { register, login, refreshAccessToken };
