const {Rental} = require("../../models/rental");
const mongoose = require("mongoose");
const {User} = require('../../models/user')
const request = require('supertest')
const moment = require('moment')
const {Movie} = require("../../models/movie")

let server
let customerId
let movieId
let rental
let movie
let token

const exec = async () => {
    return await request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId})
}


describe('/api/returns', () => {

    beforeEach(async () => {
        server = require('../../index')
        token = new User().generateAuthToken()
        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()

        movie = new Movie({
            _id:movieId,
            title: '12345',
            dailyRentalRate: 3,
            genre:{name:'12345'},
            numberInStock:10
        })
        await movie.save()

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '123455',
                phone: '12345513'
            },
            movie: {
                _id: movieId,
                title: '12345153',
                dailyRentalRate: 3
            },
        })
        await rental.save()
    })

    afterEach(async () => {
        await Rental.deleteMany({})
        await Movie.deleteMany({})
        await server.close()
    })

    it('should return 401 if client is not logged in', async () => {
        token = ''
        const res = await exec()
        expect(res.status).toBe(401)
    })

    it('should return 400 if customer id is not provided', async () => {
        customerId=''
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it('should return 400 if movie id is not provided', async () => {
        movieId=''
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it('should return 404 if no rental found', async () => {
        await Rental.deleteMany({})
        const res = await exec()
        expect(res.status).toBe(404)
    })

    it('should return 400 if rental already processed', async () => {
        rental.dateReturned = Date.now()
        await rental.save()
        const res = await exec()
        expect(res.status). toBe(400)
    })

    it('should return 200 if return is valid', async () => {
        const res = await exec()
        expect(res.status).toBe(200)
    })

    it('should set returnDate if input is valid', async () => {
        const res = await exec()

        const rentalId = await Rental.findById(rental._id)
        const dif = new Date() - rentalId.dateReturned
        expect(dif).toBeLessThan(10*1000)
    })

    it('should set rentalFee if input is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate()
        await rental.save()
        const res = await exec()

        const rentalId = await Rental.findById(rental._id)
        const dif = Date.now() - rentalId.dateReturned
        expect(rentalId.rentalFee).toBe(21)
    })

    it('should increase movie stock if input is valid', async () => {
        const res = await exec()

        const movieId = await Movie.findById(movie._id)
        expect(movieId.numberInStock).toBe(movie.numberInStock+1)
    })

    it('should rental if input is valid', async () => {
        const res = await exec()

        rentalId = await Rental.findById(rental._id)

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            'dateOut','dateReturned','rentalFee','customer','movie'
        ]))
    })



});