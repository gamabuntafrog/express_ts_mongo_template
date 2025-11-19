import mongoose from 'mongoose';
import config from './config';
import logger from './logger';

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.MONGODB_URI);
    
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error({ error }, 'MongoDB connection error');
    process.exit(1);
  }
}

export default connectDB;

