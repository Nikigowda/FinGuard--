const usersService = require('../services/users.service');

async function getAllUsers(req, res, next) {
  try {
    const users = await usersService.getAllUsers();
    return res.json({ data: users });
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.id);
    return res.json({ data: user });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await usersService.updateUser(req.params.id, req.body);
    return res.json({ message: 'User updated', data: user });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    await usersService.deleteUser(req.params.id, req.user.id);
    return res.json({ message: 'User deactivated successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
