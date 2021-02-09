const { createLogger, format, transports } = require('winston')
const winstonDaily = require('winston-daily-rotate-file')

const dailyRotateFileTransport = new transports.DailyRotateFile({
    level: "debug",
    filename : `./Log/application-%DATE%.log`,
    datePattern : "YYYY-MM-DD",
    zippedArchive : true,
    maxSize : "20m",
    maxFiles : "14d",
    format: 
        format.printf(
            info => `${info.timestamp} [${info.level}] : ${info.message}`
        )
})

const logger = createLogger({
    level: "debug",
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss.SSS"
        }),
    ),
    transports: [
        new transports.Console({
            level: "debug",
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} [${info.level}] : ${info.message}`
                )
            )
        }),
        dailyRotateFileTransport
    ]
})

module.exports = {
    logger
}