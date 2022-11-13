const winston = require("winston");
require('winston-mongodb')
require('express-async-errors')

module.exports = function (){
    process.on("unhandledRejection", (ex)=>{
        winston.error(ex.message, ex)
        process.exit(1)
    })

    winston.exceptions.handle(new winston.transports.File({filename: 'uncaughtException.log'}))

    process.on("uncaughtException", (ex)=>{
        new winston.transports.Console({colorize: true, prettyPrint:true})
        console.log('WE GOT AN UNCAUGHT EXCEPTION')
        winston.error(ex.message, ex)
    })

    winston.add(new winston.transports.File({filename:'logfile.log'}))
    winston.add(new winston.transports.MongoDB({
        db:'mongodb://localhost/vidly',
        level: 'error'
    }))

}