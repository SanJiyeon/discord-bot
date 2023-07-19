const winston = require('winston');
const WinstonCloudWatch = require('winston-aws-cloudwatch');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new WinstonCloudWatch({
      logGroupName: 'DISCORD_BOT_LOG_GROUP',
      logStreamName: 'DISCORD_BOT_LOG_STREAM',
      awsRegion: 'eu-central-1',
    }),
  ],
});

module.exports = logger;
