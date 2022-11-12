const winston = require('winston')

module.exports = function (err, req,res,next){
    winston.error(err.message, {metadata:err})

    //error
    //warning
    //info
    //verbose
    //debug
    //silly

    res.status(500).send('Something Failed')
}