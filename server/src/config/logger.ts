import winston from 'winston'

const logger = winston.createLogger({
    level: 'info',
    defaultMeta: {
        serviceName: 'expense_agent',
    },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug',
            // silent: process.env.NODE_ENV === 'production',
        }),
        new winston.transports.File({
            level: 'error',
            dirname: 'logs',
            filename: 'error.log',
            silent: process.env.NODE_ENV === 'dev',
        }),
        new winston.transports.File({
            level: 'info',
            dirname: 'logs',
            filename: 'combined.log',
            silent: process.env.NODE_ENV === 'dev',
        }),
    ],
})

export default logger