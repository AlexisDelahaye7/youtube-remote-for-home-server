import { createLogger, format, transports } from 'winston';

import 'winston-daily-rotate-file';

const {
  combine, timestamp, colorize, errors, align, printf,
} = format;

const logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      frequency: '24h',
      maxFiles: 5,
      format: combine(
        timestamp(),
        format.json(),
      ),
    }),
    new transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      frequency: '24h',
      maxFiles: 5,
      level: 'error',
      format: combine(
        errors({ stack: true }),
        timestamp(),
        format.json(),
      ),
    }),
    new transports.DailyRotateFile({
      filename: 'logs/access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      frequency: '24h',
      maxFiles: 5,
      level: 'http',
      format: combine(
        timestamp(),
        format.json(),
      ),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    level: 'debug',
    format: combine(
      colorize(),
      timestamp(),
      align(),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message} ${info.stack ? `\n${info.stack}` : ''}`),
    ),
  }));
}

export default logger;
