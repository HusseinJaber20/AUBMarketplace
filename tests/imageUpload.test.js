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

//IMPORTANT NOTE:tests related to files might require you to run them more than once.
//this is a common issue with file testing
//sometimes the issue might be related to your internet connection (since we're uploading images to aws.S3)
//try running each test separately for accurate results


//List of tests
/*
    //Products
    Should upload and delete product image
    Should not upload image to other users products
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
        .expect(201)
    
    const product = await Product.findById(productOne._id)
    expect(product.images[0]).not.toBe(undefined)
})

test('Should delete product image', async () => { 
    //uploading an image first
    const response = await request(app)
        .post(`/api/image/products/${productOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('image', 'tests/fixtures/picture.jpeg')
        .expect(201)
    
    //delete
    const url = response.body.imageURL
    const img = url.substr(url.lastIndexOf('/') + 1);
    await request(app)
        .delete(`/api/image/products/${productOne._id}/${img}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    const product = await Product.findById(productOne._id)
    expect(product.images[0]).toBe(undefined)
})

//Services

test('Should upload service image', async () => {
    await request(app)
        .post(`/api/image/services/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('image', 'tests/fixtures/picture.jpeg')
        .expect(201)
    
    const service = await Service.findById(serviceOne._id)
    expect(service.images[0]).not.toBe(undefined)
})

test('Should delete service image', async () => {
    //upload image first
    const response = await request(app)
        .post(`/api/image/services/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('image', 'tests/fixtures/picture.jpeg')
        .expect(201)

    //delete
    const url = response.body.imageURL
    const img = url.substr(url.lastIndexOf('/') + 1);
    await request(app)
        .delete(`/api/image/services/${serviceOne._id}/${img}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
})

