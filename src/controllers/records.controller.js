const recordsService = require('../services/records.service');

async function getRecords(req, res, next) {
  try {
    const result = await recordsService.getRecords(req.query, req.user.role, req.user.id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getRecordById(req, res, next) {
  try {
    const record = await recordsService.getRecordById(req.params.id);
    return res.json({ data: record });
  } catch (err) {
    next(err);
  }
}

async function createRecord(req, res, next) {
  try {
    const record = await recordsService.createRecord(req.body, req.user.id);
    return res.status(201).json({ message: 'Record created', data: record });
  } catch (err) {
    next(err);
  }
}

async function updateRecord(req, res, next) {
  try {
    const record = await recordsService.updateRecord(req.params.id, req.body);
    return res.json({ message: 'Record updated', data: record });
  } catch (err) {
    next(err);
  }
}

async function deleteRecord(req, res, next) {
  try {
    await recordsService.deleteRecord(req.params.id);
    return res.json({ message: 'Record deleted (soft)' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRecords, getRecordById, createRecord, updateRecord, deleteRecord };
