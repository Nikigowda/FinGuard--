/**
 * Seed script — run with: node prisma/seed.js
 * Creates demo users and sample financial records.
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const password = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@finance.dev' },
    update: {},
    create: { name: 'Admin User', email: 'admin@finance.dev', password, role: 'ADMIN' },
  });

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@finance.dev' },
    update: {},
    create: { name: 'Analyst User', email: 'analyst@finance.dev', password, role: 'ANALYST' },
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@finance.dev' },
    update: {},
    create: { name: 'Viewer User', email: 'viewer@finance.dev', password, role: 'VIEWER' },
  });

  console.log('✓ Users created:', admin.email, analyst.email, viewer.email);

  // Create sample financial records
  const categories = ['Salary', 'Freelance', 'Rent', 'Groceries', 'Utilities', 'Healthcare', 'Travel', 'Entertainment'];
  const records = [];

  for (let i = 0; i < 30; i++) {
    const isIncome = Math.random() > 0.45;
    const month = Math.floor(Math.random() * 4); // Last 4 months
    const date = new Date();
    date.setMonth(date.getMonth() - month);
    date.setDate(Math.floor(Math.random() * 28) + 1);

    records.push({
      amount: parseFloat((Math.random() * 4000 + 100).toFixed(2)),
      type: isIncome ? 'INCOME' : 'EXPENSE',
      category: isIncome
        ? categories[Math.floor(Math.random() * 2)]       // Salary / Freelance
        : categories[Math.floor(Math.random() * 6) + 2],  // Rent..Entertainment
      date,
      description: `Sample ${isIncome ? 'income' : 'expense'} record #${i + 1}`,
      createdById: [admin.id, analyst.id][Math.floor(Math.random() * 2)],
    });
  }

  await prisma.financialRecord.createMany({ data: records });
  console.log(`✓ ${records.length} financial records created`);
  console.log('\nDemo credentials (password: password123):');
  console.log('  admin@finance.dev   → ADMIN');
  console.log('  analyst@finance.dev → ANALYST');
  console.log('  viewer@finance.dev  → VIEWER');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
