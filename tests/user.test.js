const request = require('supertest')
const app = require('../app')
const User = require('../models/User')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

jest.mock('../emails/account')

beforeEach(setupDatabase)

test('Should get profile for user', async () => {
    // const response = await request(app)
    //     .get('/api/auth')
    //     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    //     .send()
    //     .expect(200)
})