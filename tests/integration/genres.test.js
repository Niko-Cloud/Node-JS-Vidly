const request=require('supertest')
const {Genre} = require('../../models/genre')
const {User} = require('../../models/user')
const mongoose = require('mongoose')

let server

describe('/api/genres', ()=> {
    beforeEach(()=>{
        server = require('../../index')
    })
    afterEach(async () => {
        await Genre.deleteMany({})
        await server.close()
    })
    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                {name:'genre1'},
                {name:'genre2'}
            ])

            const res = await request(server).get('/api/genres')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(g=>g.name==='genre1')).toBeTruthy()
            expect(res.body.some(g=>g.name==='genre2')).toBeTruthy()

        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({name: 'genre1'})
            await genre.save()

            const res = await request(server).get('/api/genres/'+genre._id)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', genre.name)
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1')

            expect(res.status).toBe(404)
        });
        it('should return 404 if no genre with the given id exist', async () => {
            const id = mongoose.Types.ObjectId()
            const res = await request(server).get('/api/genres/'+id)

            expect(res.status).toBe(404)
        });
    });

    describe('POST /', () => {

        //Define the happy path, and then in each test , we change
        //one parameter that clearly aligns with the name of the test

        let token,name

        const exec = async () => {
            return res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name})
        }

        beforeEach(()=>{
            token = new User().generateAuthToken()
            name = 'genre1'
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''
            const res = await exec()
            expect(res.status).toBe(401)
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234'
            const res = await exec()
            expect(res.status).toBe(400)
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a')
            const res = await exec()
            expect(res.status).toBe(400)
        });

        it('should save the genre if it is valid', async () => {
            await exec()
            const genre = await Genre.find({name:'genre1'})
            expect(genre).not.toBeNull()
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec()
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'genre1')
        });
    });

    describe("DELETE /", () => {
        let token;
        let objectId = "";

        beforeEach(() => {
            token = new User({ isAdmin: true }).generateAuthToken();
        });

        const exec = () => {
            return request(server)
                .delete(`/api/genres/${objectId}`)
                .set("x-auth-token", token);
        };

        it("should return 404 if id is invalid", async () => {
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it("should return 404 if id not found", async () => {
            objectId = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it("should return 200 if genre deleted successfully", async () => {
            objectId = new mongoose.Types.ObjectId();
            const schema = {
                _id: objectId.toHexString(),
                name: "genre1"
            };
            const genre = await new Genre(schema)
            genre.save();
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(schema);
        });
    });

    describe("PUT /", () => {
        let token, upName
        let objectId

        beforeEach(() => {
            token = new User({ isAdmin: true }).generateAuthToken();
            upName = "genre2"
            objectId = new mongoose.Types.ObjectId()
        });

        const exec = () => {
            return request(server)
                .put(`/api/genres/${objectId}`)
                .set("x-auth-token", token)
                .send({ name: upName })
        };

        it("should return error 400 if name is less than 5 characters", async () => {
            upName = "12";
            const res = await exec()
            expect(res.status).toBe(400)
        });

        it("should return error 400 if name is less than 50 characters", async () => {
            upName = new Array(52).join("a")
            const res = await exec()
            expect(res.status).toBe(400)
        });

        it("should return 500 if id is invalid", async () => {
            objectId = "a"
            const res = await exec()
            expect(res.status).toBe(500)
        });

        it("should return 404 if id is not found", async () => {
            const res = await exec()
            expect(res.status).toBe(404)
        });

        it("should return 200 if update is succesful", async () => {
            const genre = await new Genre({ name: "genre1", _id: objectId }).save();
            const res = await exec()
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({
                _id: genre._id.toHexString(),
                name: "genre2"
            });
        });
    });
});

