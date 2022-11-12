const {Movie, validate} = require('../models/movie')
const {Genre} = require('../models/genre')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const movies = await Movie.find()
        .sort('title')
    res.send(movies)
})


router.get('/:id',async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send("MOVIES_ID_NOT_FOUND")
    res.send(movie)
})

router.post('/',async (req, res) => {
    const {error, result} = validate(req.body)
    if (error) return res.status(404).send(error.details[0].message)

    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(404).send(error.details[0].message)

    let movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre:{
            _id: genre._id,
            name: genre.name
        }
    })
    movie = await movie.save()
    res.send(movie)
})

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body)
    if (error) return res.status(404).send(error.details[0].message)
    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(404).send(error.details[0].message)

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre:{
            _id: genre._id,
            name: genre.name
        }
    }, {
        new: true
    })
    if (!movie) return res.status(404).send("MOVIE_ID_NOT_FOUND")
    res.send(movie)
})

router.delete('/:id',async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)
    if (!movie) return res.status(404).send("MOVIE_ID_NOT_FOUND")
    res.send(movie)
})


module.exports = router