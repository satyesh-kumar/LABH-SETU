require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const logger = require('./src/utils/logger');
const seedDemoData = require('./src/scripts/seed-demo-data');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database (with automatic MongoMemoryServer fallback if needed)
    await connectDB();

    // Auto-seed demo data if database is empty so system works immediately
    await seedDemoData({ silentIfPopulated: true });

    const server = app.listen(PORT, () => {
      logger.info(`LabhSetu API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      logger.info(`API Base URL: http://localhost:${PORT}/api`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received. Closing HTTP server gracefully.`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start LabhSetu Server', { error: error.message });
    process.exit(1);
  }
};

startServer();
