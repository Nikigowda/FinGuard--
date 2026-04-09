const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const { validate } = require('../middleware/validate');
const { updateUserSchema } = require('../schemas');

// All user management routes require authentication + ADMIN role
router.use(authenticate, requireRole('ADMIN'));

// GET /api/users
router.get('/', usersController.getAllUsers);

// GET /api/users/:id
router.get('/:id', usersController.getUserById);

// PATCH /api/users/:id
router.patch('/:id', validate(updateUserSchema), usersController.updateUser);

// DELETE /api/users/:id  — soft delete (deactivates)
router.delete('/:id', usersController.deleteUser);

module.exports = router;
