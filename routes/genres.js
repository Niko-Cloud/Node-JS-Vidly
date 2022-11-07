const express = require('express')
const router = express.Router()
const Joi = require('joi')

const genres = [
    {
        id:1,
        genre:'action'
    },
    {
        id:2,
        genre:"romance"
    },
    {
        id:3,
        genre:"horror"
    }
]

router.get('/:id',(req, res)=>{
    const genre = genres.find(c=>c.id === parseInt(req.params.id))
    if(!genre) return res.status(404).send("MOVIES_ID_NOT_FOUND")
    res.send(genre)
})

router.post('/',(req, res)=>{
    const {error,result}= schemaValidation(req.body)
    if(error) return res.status(404).send(error.details[0].message)

    const movie =
        {
            id: genres.length+1,
            genre:req.body.genre
        }
    genres.push(movie)
    res.send(movie)
})

router.put('/:id', (req,res)=>{
    const movie = genres.find(c=>c.id === parseInt(req.params.id))
    if (!movie) return res.status(404).send("MOVIE_ID_NOT_FOUND")

    const {error,result}= schemaValidation(req.body)

    if(error) return res.status(404).send(error.details[0].message)
    movie.genre = req.body.genre
    res.send(movie)
})

router.delete('/:id',(req, res) => {
    const movie = genres.find(c=>c.id === parseInt(req.params.id))
    if (!movie) return res.status(404).send("MOVIE_ID_NOT_FOUND")

    const index = genres.indexOf(movie)
    genres.splice(index, 1)
    res.send(movie)

})

const schemaValidation = (movie) => {
    const schema= Joi.object(
        {
            genre: Joi.string().min(3).required()
        }
    )
    return schema.validate(movie)
}

module.exports = router