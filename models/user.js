const mongoose = require('mongoose')
const Joi = require('joi')

const User = mongoose.model('User', new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email:{
        type:String,
        required:true,
        minlength: 5,
        maxlength: 255,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength: 5,
        maxlength: 1024,
    }
}))

const schemaValidation = (movie) => {
    const schema= Joi.object(
        {
            name: Joi.string().min(5).max(50).required(),
            email: Joi.string().min(5).max(255).required().email(),
            password: Joi.string().min(5).max(255).required()
        }
    )
    return schema.validate(movie)
}

exports.User = User
exports.validate = schemaValidation