const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/records.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const { validate } = require('../middleware/validate');
const { createRecordSchema, updateRecordSchema } = require('../schemas');

// All record routes require authentication
router.use(authenticate);

// GET /api/records  — all roles can read (VIEWERs see only their own records)
router.get('/', recordsController.getRecords);

// GET /api/records/:id  — all roles
router.get('/:id', recordsController.getRecordById);

// POST /api/records  — ANALYST and ADMIN only
router.post(
  '/',
  requireRole('ANALYST', 'ADMIN'),
  validate(createRecordSchema),
  recordsController.createRecord
);

// PATCH /api/records/:id  — ADMIN only
router.patch(
  '/:id',
  requireRole('ADMIN'),
  validate(updateRecordSchema),
  recordsController.updateRecord
);

// DELETE /api/records/:id  — ADMIN only (soft delete)
router.delete('/:id', requireRole('ADMIN'), recordsController.deleteRecord);

module.exports = router;
