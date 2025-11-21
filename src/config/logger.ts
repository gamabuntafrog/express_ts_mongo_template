import pino from 'pino';
import config from '@config/config';

const loggerOptions: pino.LoggerOptions = {
  level: config.LOG_LEVEL || (config.isDevelopment() ? 'debug' : 'info'),
  transport: config.isDevelopment()
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      }
    : undefined
};

const logger = pino(loggerOptions);

export default logger;

