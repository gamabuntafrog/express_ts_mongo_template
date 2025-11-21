import { Request, Response, NextFunction } from 'express';
import logger from '@config/logger';

/**
 * Request logging middleware using pino logger
 * Logs all requests with method, URL, status code, and duration in one line
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const { method, originalUrl } = req;

  // Capture response finish event
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    const logMessage = `${method} ${originalUrl} ${statusCode} ${duration}ms`;

    if (statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.info(logMessage);
    }
  });

  next();
}

