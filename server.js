require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/config/database');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 3000;

async function seed() {
  const count = await prisma.user.count();
  if (count > 0) return;

  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      { name: 'Admin User',   email: 'admin@finance.dev',   password: hash, role: 'ADMIN' },
      { name: 'Analyst User', email: 'analyst@finance.dev', password: hash, role: 'ANALYST' },
      { name: 'Viewer User',  email: 'viewer@finance.dev',  password: hash, role: 'VIEWER' },
    ]
  });
  console.log('✓ Demo users seeded');
}

async function main() {
  console.log('Running migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  await prisma.$connect();
  console.log('✓ Database connected');

  await seed();

  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});