const {Rental} = require('../models/rental')
const express = require('express')
const {Genre, validate} = require("../models/genre");
const router= express()
const auth = require('../middleware/auth')
const moment = require('moment')
const {Movie} = require('../models/movie')
const Joi = require('joi')
const validation = require('../middleware/validation')

const validateReturn = (req) => {
    const schema= Joi.object(
        {
            customerId: Joi.objectId().required(),
            movieId: Joi.objectId().required()
        }
    )
    return schema.validate(req)
}

router.post('/',[auth,validation(validateReturn)],async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

    if(!rental) return res.status(404).send('Rental Not Found')
    if(rental.dateReturned) return res.status(400).send('Return already Processed')

    rental.return()
    await rental.save()

    await Movie.updateOne({_id:rental.movie._id},{
        $inc:{
            numberInStock:1
        }
    })

    return res.send(rental)
})


module.exports = router