const prisma = require('../config/database');

/**
 * Build a Prisma `where` clause from query params.
 * All params are optional.
 */
function buildFilter({ type, category, dateFrom, dateTo }) {
  const where = { isDeleted: false };

  if (type) where.type = type;
  if (category) where.category = { contains: category };

  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = new Date(dateFrom);
    if (dateTo) where.date.lte = new Date(dateTo);
  }

  return where;
}

async function getRecords(query, userRole, userId) {
  const { type, category, dateFrom, dateTo, page = '1', limit = '20' } = query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const where = buildFilter({ type, category, dateFrom, dateTo });

  // VIEWERs can only see their own records
  if (userRole === 'VIEWER') {
    where.createdById = userId;
  }

  const [records, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { date: 'desc' },
      include: { createdBy: { select: { id: true, name: true, email: true } } },
    }),
    prisma.financialRecord.count({ where }),
  ]);

  return {
    data: records,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

async function getRecordById(id) {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
    include: { createdBy: { select: { id: true, name: true, email: true } } },
  });

  if (!record) {
    const err = new Error('Record not found');
    err.statusCode = 404;
    throw err;
  }

  return record;
}

async function createRecord(data, userId) {
  return prisma.financialRecord.create({
    data: { ...data, createdById: userId },
    include: { createdBy: { select: { id: true, name: true, email: true } } },
  });
}

async function updateRecord(id, data) {
  const record = await prisma.financialRecord.findFirst({ where: { id, isDeleted: false } });

  if (!record) {
    const err = new Error('Record not found');
    err.statusCode = 404;
    throw err;
  }

  return prisma.financialRecord.update({
    where: { id },
    data,
    include: { createdBy: { select: { id: true, name: true, email: true } } },
  });
}

async function deleteRecord(id) {
  const record = await prisma.financialRecord.findFirst({ where: { id, isDeleted: false } });

  if (!record) {
    const err = new Error('Record not found');
    err.statusCode = 404;
    throw err;
  }

  // Soft delete
  return prisma.financialRecord.update({
    where: { id },
    data: { isDeleted: true },
    select: { id: true },
  });
}

module.exports = { getRecords, getRecordById, createRecord, updateRecord, deleteRecord };
