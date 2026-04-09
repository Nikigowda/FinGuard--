const prisma = require('../config/database');

async function getSummary() {
  const [income, expense, categoryTotals, recentActivity] = await Promise.all([
    // Total income
    prisma.financialRecord.aggregate({
      where: { type: 'INCOME', isDeleted: false },
      _sum: { amount: true },
      _count: true,
    }),

    // Total expense
    prisma.financialRecord.aggregate({
      where: { type: 'EXPENSE', isDeleted: false },
      _sum: { amount: true },
      _count: true,
    }),

    // Category-wise totals (raw groupBy)
    prisma.financialRecord.groupBy({
      by: ['category', 'type'],
      where: { isDeleted: false },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: 'desc' } },
    }),

    // Recent 5 transactions
    prisma.financialRecord.findMany({
      where: { isDeleted: false },
      take: 5,
      orderBy: { date: 'desc' },
      select: { id: true, amount: true, type: true, category: true, date: true, description: true },
    }),
  ]);

  const totalIncome = income._sum.amount ?? 0;
  const totalExpense = expense._sum.amount ?? 0;
  const netBalance = totalIncome - totalExpense;

  return {
    summary: {
      totalIncome,
      totalExpense,
      netBalance,
      incomeCount: income._count,
      expenseCount: expense._count,
    },
    categoryBreakdown: categoryTotals.map((c) => ({
      category: c.category,
      type: c.type,
      total: c._sum.amount ?? 0,
      count: c._count,
    })),
    recentActivity,
  };
}

async function getMonthlyTrends(year) {
  const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();

  const records = await prisma.financialRecord.findMany({
    where: {
      isDeleted: false,
      date: {
        gte: new Date(`${targetYear}-01-01`),
        lte: new Date(`${targetYear}-12-31`),
      },
    },
    select: { amount: true, type: true, date: true },
  });

  // Aggregate client-side by month (SQLite lacks date_trunc)
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthLabel: new Date(targetYear, i, 1).toLocaleString('default', { month: 'short' }),
    income: 0,
    expense: 0,
  }));

  for (const r of records) {
    const m = new Date(r.date).getMonth(); // 0-indexed
    if (r.type === 'INCOME') months[m].income += r.amount;
    else months[m].expense += r.amount;
  }

  return {
    year: targetYear,
    trends: months.map((m) => ({ ...m, net: m.income - m.expense })),
  };
}

async function getWeeklyTrends() {
  const now = new Date();
  const fourWeeksAgo = new Date(now);
  fourWeeksAgo.setDate(now.getDate() - 28);

  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false, date: { gte: fourWeeksAgo } },
    select: { amount: true, type: true, date: true },
    orderBy: { date: 'asc' },
  });

  // Group into 7-day buckets
  const weeks = {};
  for (const r of records) {
    const d = new Date(r.date);
    // Get Monday of that week
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const key = monday.toISOString().slice(0, 10);

    if (!weeks[key]) weeks[key] = { weekStart: key, income: 0, expense: 0 };
    if (r.type === 'INCOME') weeks[key].income += r.amount;
    else weeks[key].expense += r.amount;
  }

  const sorted = Object.values(weeks)
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart))
    .map((w) => ({ ...w, net: w.income - w.expense }));

  return { weeks: sorted };
}

module.exports = { getSummary, getMonthlyTrends, getWeeklyTrends };
