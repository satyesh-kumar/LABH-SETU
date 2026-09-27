const mongoose = require('mongoose');
const logger = require('../utils/logger');

let memoryServerInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && !uri.includes('localhost:27017')) {
      // Connect to provided remote/Atlas URI
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      logger.info('Connected to MongoDB via URI successfully');
      return;
    }

    // Try connecting to URI (e.g. local) with low timeout
    if (uri) {
      try {
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 2000,
        });
        logger.info('Connected to local MongoDB instance');
        return;
      } catch (err) {
        logger.warn('Local MongoDB connection failed. Falling back to embedded MongoMemoryServer for development.');
      }
    }

    // Fallback to MongoMemoryServer
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServerInstance = await MongoMemoryServer.create();
    const memUri = memoryServerInstance.getUri();
    await mongoose.connect(memUri);
    logger.info(`Connected to embedded MongoDB Memory Server at: ${memUri}`);
  } catch (error) {
    logger.error('Failed to establish database connection', { error: error.message });
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
    }
    logger.info('Disconnected from database');
  } catch (error) {
    logger.error('Error disconnecting from database', { error: error.message });
  }
};

module.exports = { connectDB, disconnectDB };
