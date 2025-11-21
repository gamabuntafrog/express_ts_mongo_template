import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from '@config/config';
import logger from '@config/logger';
import connectDB from '@config/database';
import userRepository from '@repositories/UserRepository';
import authRoutes from '@routes/authRoutes';
import userRoutes from '@routes/userRoutes';
import { errorHandler } from '@middleware/errorHandler';
import { ERROR_CODES } from '@constants/errorCodes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB and initialize indexes using top-level await
await connectDB();
await userRepository.createIndexes();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/health', function(req: Request, res: Response) {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running' 
  });
});

// 404 handler
app.use(function(req: Request, res: Response) {
  res.status(404).json({ 
    success: false,
    code: ERROR_CODES.NOT_FOUND,
    message: 'Route not found' 
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(config.PORT, function() {
  logger.info(`Server is running on port ${config.PORT}`);
});

export default app;

