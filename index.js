
const express = require('express')
const app = express()
const genres = require('./routes/genres')
const home = require('./routes/home')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/movies', genres)
app.use('/', home)

const port = process.env.PORT || 3000
app.listen(port,()=>console.log(`Listening to ${port}`))