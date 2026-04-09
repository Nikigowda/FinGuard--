const prisma = require('../config/database');

const safeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

async function getAllUsers() {
  return prisma.user.findMany({ select: safeSelect, orderBy: { createdAt: 'desc' } });
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({ where: { id }, select: safeSelect });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
}

async function updateUser(id, data) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return prisma.user.update({ where: { id }, data, select: safeSelect });
}

async function deleteUser(id, requesterId) {
  if (id === requesterId) {
    const err = new Error('You cannot delete yourself');
    err.statusCode = 400;
    throw err;
  }
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  // Soft-delete by deactivating
  return prisma.user.update({ where: { id }, data: { isActive: false }, select: safeSelect });
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
