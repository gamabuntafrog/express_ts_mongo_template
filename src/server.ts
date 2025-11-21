import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from '@config/config';
import logger from '@config/logger';
import connectDB, { getDb } from '@config/database';
import UserRepository from '@repositories/UserRepository';
import AuthService from '@services/authService';
import UserService from '@services/userService';
import AuthController from '@controllers/authController';
import UserController from '@controllers/userController';
import createAuthRoutes from '@routes/authRoutes';
import createUserRoutes from '@routes/userRoutes';
import { errorHandler } from '@middleware/errorHandler';
import { ERROR_CODES } from '@constants/errorCodes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
await connectDB();

// Initialize repositories with database collections
const userRepository = new UserRepository(getDb().collection('users'));
await userRepository.createIndexes();

// Initialize services with repositories
const authService = new AuthService(userRepository);
const userService = new UserService(userRepository);

// Initialize controllers with services
const authController = new AuthController(authService);
const userController = new UserController(userService);

// Initialize routes with controllers
const authRoutes = createAuthRoutes(authController);
const userRoutes = createUserRoutes(userController);

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

