require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function main() {
  // Verify DB connection on startup
  await prisma.$connect();
  console.log('✓ Database connected');

  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`  Environment : ${process.env.NODE_ENV}`);
    console.log(`  Health check: http://localhost:${PORT}/health`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
