const { z } = require('zod');

// ─── Auth ────────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Users ───────────────────────────────────────────────────────────────────

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
});

// ─── Financial Records ───────────────────────────────────────────────────────

const createRecordSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Category is required'),
  date: z.coerce.date(),
  description: z.string().optional(),
});

const updateRecordSchema = createRecordSchema.partial();

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  createRecordSchema,
  updateRecordSchema,
};
