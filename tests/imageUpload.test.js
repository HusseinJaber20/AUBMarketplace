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
    Should not upload image to other users products
    Should delete users product image
    Should not delete other users product image
    //Services
    Should upload and delete service image
    Should not upload image to other users services
    Should not delete other users service image
*/

//Products

test('Should upload product image', async () => {
    await request(app)
        .post(`/api/image/products/${productOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('image', 'tests/fixtures/picture.jpeg')
        .expect(200)
    
    const product = await Product.findById(productOne._id)
    expect(product.images[0]).not.toBe(undefined)
})

test('Should not upload image to other users products', async () => {
    await request(app)
        .post(`/api/image/products/${productOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .attach('image', 'tests/fixtures/picture.jpeg')
        .expect(401)
    
    const product = await Product.findById(productOne._id)
    //console.log(product.images)
    expect(product.images[0]).toBe(undefined)
})

// test('Should delete users product image', async () => {

// })

// test('Should not delete other users product image', async () => {

// })

//Services

test('Should upload and delete service image', async () => {
    //upload
    const response = await request(app)
        .post(`/api/image/services/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('image', 'tests/fixtures/picture.jpeg')
        .expect(200)
    
    const service = await Service.findById(serviceOne._id)
    expect(service.images[0]).not.toBe(undefined)


    //delete
    //console.log(response.body)
})

test('Should not upload image to other users services', async () => {
    const response = await request(app)
        .post(`/api/image/services/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .attach('image', 'tests/fixtures/picture.jpeg')
        .expect(401)
    
    const service = await Service.findById(serviceOne._id)
    expect(service.images[0]).toBe(undefined)
    console.log(response.body)
    
})


// test('Should not delete other users service image', async () => {
    
// })