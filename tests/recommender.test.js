const request = require('supertest')
const app = require('../app')
const Service = require('../models/Service')
const {     
    userOneId, userOne,
    userTwoId, userTwo,
    serviceOne, serviceTwo, serviceThree,
    productOne, productTwo, productThree,
    setupDatabase 
    } = require('./fixtures/db')

beforeEach(setupDatabase)

//List of tests
/*
    //Products
    Should recommend products based on major
    //Services
    Should recommend service based on major

    TODO: hottest, newest
*/

//Products

test('Should recommend products based on major', async () => {
    const response = await request(app)
        .get('/api/recommend/products')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.data.length).toBe(1)
})

//Services

test('Should recommend service based on major', async () => {
    const response = await request(app)
        .get('/api/recommend/services')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.data.length).toBe(1)
})

