const mongoose = require('mongoose')
const express = require('express')
const app = express()
const genres = require('./routes/genres')
const customers = require('./routes/customers')

mongoose.connect('mongodb://localhost/vidly')
    .then(()=>console.log('Connected to MongoDB...'))
    .catch(err=> console.error('Could not connect to mongoDB'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/genres', genres)
app.use('/api/customers', customers)

const port = process.env.PORT || 3000
app.listen(port,()=>console.log(`Listening to ${port}`))