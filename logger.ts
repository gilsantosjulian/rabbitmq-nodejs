import { createLogger, format, transports } from 'winston';
const { combine, timestamp, colorize, printf } = format;
const expressWinston = require('express-winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');

const IS_DEPLOYED = process.env.NODE_ENV === 'production';

const productionMsgFormat = combine(printf((info: any) => info.message));

const developmentMsgFormat = combine(
  colorize(),
  timestamp({
    format: 'YYYY-MM-DDTHH:mm:SS',
  }),
  printf(info => `${info.timestamp} ${info.level} ${info.message}`),
);

const getWinstonTransport = () => {
  if (IS_DEPLOYED) {
    const loggingWinston = new LoggingWinston({
      serviceContext: {
        service: 'vendors',
        version: '0.0.1',
      },
    });
    return loggingWinston;
  }

  return new transports.Console();
};

const logger = createLogger({
  transports: [new transports.Console({ level: 'debug' })],
  format: IS_DEPLOYED ? productionMsgFormat : developmentMsgFormat,
});

const requestLogger = expressWinston.logger({
  transports: [],
  format: combine(
    colorize(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    printf(
      info =>
        `${info.timestamp} ${info.level}: ${info.message} - ${JSON.stringify(
          info.meta.res,
        )}`,
    ),
  ),
});

const errorLogger = expressWinston.errorLogger({
  transports: [],
  format: combine(
    colorize(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    printf(info => `${info.timestamp} ${info.level}: ${JSON.stringify(info, null, 2)}`),
  ),
});

export = {
  requestLogger,
  errorLogger,
  info: (message: string) => logger.info(message),
  error: (error: any) => logger.error(error),
  debug: (debug: string) => logger.debug(debug),
};
