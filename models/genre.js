const Joi = require('joi')
const mongoose = require("mongoose");

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    }
}))

const schemaValidation = (movie) => {
    const schema= Joi.object(
        {
            name: Joi.string().min(5).required()
        }
    )
    return schema.validate(movie)
}

exports.Genre = Genre
exports.validate = schemaValidation