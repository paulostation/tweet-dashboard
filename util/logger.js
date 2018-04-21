/* jshint esversion:6 */
const winston = require('winston'),
    winstonCouch = require('winston-couchdb').Couchdb,
    level = process.env.LOG_LEVEL || 'debug',
    moment = require('moment-timezone'),
    tsFormat = () => new Date(moment.tz(Date.now(),
        "America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"));

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: level,
            timestamp: tsFormat,
            colorize: true
        }),
        new (winston.transports.File)({
            filename: 'error.log',
            level: "error",
            //100 MB for each log file
            maxsize: 107374182400, 
            maxFiles: 4,
            timestamp: tsFormat
        }),
        new (winstonCouch)( {
            host: process.env.DATABASE_HOST,
            db: "app_log",
            port: 443,
            auth: {
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD
            },
            ssl: true,
            level: "error",
            timestamp: tsFormat
        })
    ]
});

module.exports = logger;