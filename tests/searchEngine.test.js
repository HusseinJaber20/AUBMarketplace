const request = require('supertest')
const app = require('../app')
const Service = require('../models/Service')
const { userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

//List of tests
/*
    //Search products
    Should get products based on category
    Should get products based on keywords
    //Search services
    Should get services based on category
    Should get services based on keywords
*/
test('Should get products based on category', async () => {
    const response = await request(app)
        .get('/api/search/products/category/Book')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})

//need to have an online DB for this
// test('Should get products based on keywords', async () => {
//     const response = await request(app)
//         .get('/api/search/products?query=good')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)

//     console.log(response.body)
//     expect(response.body.length).toBe(2)
// })

test('Should get services based on category', async () => {
    const response = await request(app)
        .get('/api/search/services/category/Other')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})

// test('Should get services based on keywords', async () => {
//     const response = await request(app)
//         .get('/api/search/services?query=first')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)

//     console.log(response.body)
//     expect(response.body.length).toBe(1)
// })