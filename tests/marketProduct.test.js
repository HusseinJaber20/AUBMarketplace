const request = require('supertest')
const app = require('../app')
const Product = require('../models/Product')
const {     
    userOneId, userOne,
    userTwoId, userTwo,
    productOne, productTwo, productThree,
    setupDatabase 
    } = require('./fixtures/db')

jest.mock('../emails/account')

beforeEach(setupDatabase)

test('', async () => {
    
})
// test('Should request a product', async () => {
//     const response = await request(app)
//         .get(`/api/market/products/buy/${productOne._id}`)
//         .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
//         .send()
//         .expect(201)
// })

// test('Should not request your own product', async () => {
//     const response = await request(app)
//         .get(`/api/market/products/buy/${productOne._id}`)
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(400)
// })






