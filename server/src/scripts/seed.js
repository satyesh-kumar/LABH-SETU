require('dotenv').config();
const { connectDB, disconnectDB } = require('../config/db');
const seedDemoData = require('./seed-demo-data');
const logger = require('../utils/logger');

const runSeed = async () => {
  try {
    await connectDB();
    await seedDemoData({ silentIfPopulated: false });
    logger.info('Standalone seed script completed successfully.');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error('Error during standalone seed', { error: error.message });
    process.exit(1);
  }
};

runSeed();
