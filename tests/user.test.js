const request = require('supertest')
const app = require('../app')
const User = require('../models/User')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

jest.mock('../emails/account')

beforeEach(setupDatabase)

test('Should login existing user', async () => {
    const response = await request(app).post('/api/auth')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)
    
    expect(response.body.token).toEqual(expect.any(String))
})

test('Should get profile for user', async () => {
    const response = await request(app)
        .get('/api/auth')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(response.body._id)
    expect(user.email).toEqual(userOne.email)
})