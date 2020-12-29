const request = require('supertest')
const app = require('../app')
const Product = require('../models/product')
const {     
    userOneId, userOne,
    userTwoId, userTwo,
    productOne, productTwo, productThree,
    setupDatabase 
    } = require('./fixtures/db')

beforeEach(setupDatabase)

// List of tests
/*
    //Create
    Should create product for user
    Should not create product for unauthenticated user
    Should not create product with invalid/missing field
    //Read
    Should fetch user products
    Should fetch product by ID
    //Update
    Should update user product
    Should not update user product if aunauthenticated
    Should not update product with invalid field
    Should not update other users product
    //Delete
    Should delete user product
    Should not delete product if unauthenticated
    Should not delete other users products
*/

//Create

test('Should create product for user', async () => {
    const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Matlab license',
            description: 'Still valid',
            price: 5000,
            majors: ['CCE', 'ECE', 'CSE'],
        })
        .expect(201)
    
    const product = await Product.findById(response.body._id)
    expect(product).not.toBeNull()
    expect(product.status).toEqual('Available')
    expect(product.currency).toEqual('LBP')
    expect(product.category).toEqual('Other')
})


test('Should not create product for unauthenticated user', async () => {
    await request(app)
        .post('/api/products')
        .send({
            name: 'Matlab license',
            description: 'Still valid',
            price: 5000,
            majors: ['CCE', 'ECE', 'CSE'],
        })
        .expect(401)
})

test('Should not create product with invalid/missing field', async () => {
    //invalid field
    await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            title: 'Matlab license',
            description: 'Still valid',
            price: 5000,
            majors: ['CCE', 'ECE', 'CSE'],
        })
        .expect(400)
    
    //missing field name
    await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Still valid',
            price: 5000,
            majors: ['CCE', 'ECE', 'CSE'],
        })
        .expect(400)
})

//Read

test('Should fetch user products', async () => {
    const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.length).toEqual(2)
})

test('Should fetch product by ID', async () => {
    const response = await request(app)
        .get(`/api/products/${productOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body._id).toBe((productOne._id).toString())
})

//Update

test('Should update user product', async () => {
    const response = await request(app)
        .patch(`/api/products/${productOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'New Name'
        })
        .expect(200)
    
    const product = await Product.findById(productOne._id)
    expect(product.name).toBe('New Name')
})

test('Should not update user product if aunauthenticated', async () => {
    await request(app)
        .patch(`/api/products/${productOne._id}`)
        .send({
            name: 'New Name'
        })
        .expect(401)
    
    const product = await Product.findById(productOne._id)
    expect(product.name).toBe(productOne.name)
})

test('Should not update product with invalid field', async () => {
    await request(app)
        .patch(`/api/products/${productOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            field: 'bad field'
        })
        .expect(400)
})

test('Should not update other users product', async () => {
    const response = await request(app)
        .patch(`/api/products/${productThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'New Name'
        })
        .expect(404)
})

//Delete

test('Should delete user product', async () => {
    await request(app)
        .delete(`/api/products/${productOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const product = await Product.findById(productOne._id)
    expect(product).toBeNull()
})

test('Should not delete product if unauthenticated', async () => {
    await request(app)
        .delete(`/api/products/${productOne._id}`)
        .send()
        .expect(401)
    
    const product = await Product.findById(productOne._id)
    expect(product).not.toBeNull()
})

test('Should not delete other users products', async () => {
    await request(app)
        .delete(`/api/products/${productOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    
    const product = await Product.findById(productOne._id)
    expect(product).not.toBeNull()
})

