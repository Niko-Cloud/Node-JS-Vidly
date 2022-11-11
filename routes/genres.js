const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const Joi = require('joi')

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    }
}))

router.get('/', async (req, res) => {
    const genres = await Genre.find()
        .sort('name')
    res.send(genres)
})


router.get('/:id',async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send("MOVIES_ID_NOT_FOUND")
    res.send(genre)
})

router.post('/',async (req, res) => {
    const {error, result} = schemaValidation(req.body)
    if (error) return res.status(404).send(error.details[0].message)

    let genre = new Genre({name: req.body.name})
    genre = await genre.save()
    res.send(genre)
})

router.put('/:id', async (req, res) => {
    const {error} = schemaValidation(req.body)
    if (error) return res.status(404).send(error.details[0].message)

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
        new: true
    })
    if (!genre) return res.status(404).send("MOVIE_ID_NOT_FOUND")
    res.send(genre)
})

router.delete('/:id',async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if (!genre) return res.status(404).send("MOVIE_ID_NOT_FOUND")
    res.send(movie)
})

const schemaValidation = (movie) => {
    const schema= Joi.object(
        {
            name: Joi.string().min(5).required()
        }
    )
    return schema.validate(movie)
}

module.exports = router