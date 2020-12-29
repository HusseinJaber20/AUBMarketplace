const request = require('supertest')
const app = require('../app')
const Service = require('../models/Service')
const Product = require('../models/Product')
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
    Should upload product image
    //Services
    Should upload service image

    TODO: delete images!!!

*/

//Products

test('Should upload product image', async () => {
    await request(app)
        .post(`/api/image/products/${productOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('image', 'tests/fixtures/picture.jpeg')
        .expect(200)
    
    const product = await Product.findById(productOne._id)
    expect(product.images[0]).not.toBeNull()
})

//Services

test('Should upload service image', async () => {
    await request(app)
        .post(`/api/image/services/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('image', 'tests/fixtures/picture.jpeg')
        .expect(200)
    
    const service = await Service.findById(serviceOne._id)
    expect(service.images[0]).not.toBeNull()
})


