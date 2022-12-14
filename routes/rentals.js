const {Customer} = require('../models/customer')
const {Rental, validate} = require('../models/rental')
const {Movie} = require('../models/movie')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const rentals = await Rental.find()
        .sort('-dateOut')
    res.send(rentals)
})

router.get('/:id',async (req, res) => {
    const rental = await Rental.findById(req.params.id)
    if (!rental) return res.status(404).send("RENTAL_ID_NOT_FOUND")
    res.send(rental)
})

router.post('/',async (req, res) => {
    const {error, result} = validate(req.body)
    if (error) return res.status(404).send(error.details[0].message)

    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(404).send('Customer Not Found')

    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(404).send('Movie Not Found')

    if (movie.numberInStock === 0) return res.status(400).send('Movie Is Not Available')

    const rental = new Rental({
        customer:{
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie:{
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })
    try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            await rental.save();
            movie.numberInStock--;
            movie.save();
            res.send(rental);
        });
        session.endSession();
    } catch (error) {
        console.log('error111', error.message);
    }
})

module.exports = router