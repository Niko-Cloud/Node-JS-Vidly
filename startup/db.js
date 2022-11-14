const mongoose = require('mongoose')
const winston = require('winston')
const config = require('config')
const {loggers} = require("winston");

module.exports=function (){
    const db = config.get('db')
    mongoose.connect(db)
        .then(()=>
            winston.info(`Connected to ${db}`))
            winston.add(new winston.transports.Console({
                format: winston.format.simple()
            }))
}
