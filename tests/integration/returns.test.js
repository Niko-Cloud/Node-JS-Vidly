const {Rental} = require("../../models/rental");
const mongoose = require("mongoose");
const {User} = require('../../models/user')
const request = require('supertest')



describe('/api/returns', () => {
    let server
    let customerId
    let movieId
    let rental
    let token

    const exec = async () => {
        return await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId, movieId})
    }

    beforeEach(async () => {
        token = new User().generateAuthToken()
        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        })
        await rental.save()
    })

    afterEach(async () => {
        jest.useRealTimers();
        await server.close()
        await Rental.deleteMany({})
    })

    it('should return 401 if client is not logged in', async () => {
        jest.useFakeTimers('legacy');
        token = ''
        const res = await exec()
        expect(res.status).toBe(401)
    });

    it('should return 400 if customer id is not provided', async () => {
        jest.useFakeTimers('legacy');
        const res = await exec()
        expect(res.status).toBe(400)
    });

    it('should return 400 if movie id is not provided', async () => {
        jest.useFakeTimers('legacy');
        const res = await exec()
        expect(res.status).toBe(400)
    });
});