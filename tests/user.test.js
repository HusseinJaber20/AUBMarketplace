const request = require('supertest')
const app = require('../app')
const User = require('../models/User')
const Product = require('../models/Product')
const Service = require('../models/Service')
const { userOneId, userOne, userTwoId, userTwo, setupDatabase } = require('./fixtures/db')

jest.mock('../emails/account')

beforeEach(setupDatabase)

// List of tests
/*
    //Create
    Should signup a new user
    Should not signup user with invalid email
    //Login
    Should login existing user
    Should not login nonexistent user
    //Read
    Should get profile for authenticated user
    Should get other user profile by ID
    Should not get profile for unauthenticated user
    //Update
    Should update valid user fields
    Should hash password after updating user password field
    Should not update invalid user fields
    Should not update user if unauthenticated
    //delete
    Should delete account for user
    Should not delete account for unauthenticated user
*/

// Create

test('Should signup a new user', async () => {

    const response = await request(app).post('/api/users').send({
        name: 'Maria',
        email: 'mtm12@mail.aub.edu',
        password: 'Hello.123',
        number: 12345678,
        major: 'CSE',
        interests: ['programming', 'math'] 
    }).expect(201)

    //Assert that the DB was changed correctly
    const user = await User.findOne({email: 'mtm12@mail.aub.edu' })
    expect(user).not.toBeNull()

    //check if password got hashed
    expect(user.password).not.toBe('Hello.123')
})

test('Should not signup user with invalid email', async () => {
    const response = await request(app).post('/api/users').send({
        name: 'Maria',
        email: 'mtm12@example.com',
        password: 'Hello.123',
        number: 12345678,
        major: 'CSE',
        interests: ['programming', 'math'] 
    }).expect(400)

    //check that not added to DB
    expect(response.body.token).toBe(undefined)
    const user = await User.findOne({email: 'mtm12@mail.aub.edu' })
    expect(user).toBeNull()
})

//Login

test('Should login existing user', async () => {
    const response = await request(app).post('/api/auth')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
    
    expect(response.body.token).toEqual(expect.any(String))
})

test('Should not login nonexistent user', async () => {
    await request(app)
        .post('/api/auth')
        .send({
        email: userOne.email,
        password: 'notMyPass'
        })
        .expect(400)
})

//Read

test('Should get profile for authenticated user', async () => {
    await request(app)
        .get('/api/auth')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should get other user profile by ID', async () => {
    const response = await request(app)
        .get(`/api/users/${userTwoId}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.email).toEqual(userTwo.email)
    expect(response.body.password).toBe(undefined)
    expect(response.body.tokens).toBe(undefined)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/api/auth')
        .send()
        .expect(401)
})

//Update

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/api/users')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Hussein'
        })
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user.name).toEqual('Hussein')
})

test('Should hash password after updating user password field', async () => {
    await request(app)
        .patch('/api/users')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: 'ChangedPassword.123'
        })
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user.password).not.toEqual('ChangedPassword.123')
})

test('Should not update invalid user fields', async () => {
    await request(app)
    .patch('/api/users')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        Lunch: 'Pizza'
    })
    .expect(400)
})

test('Should not update user if unauthenticated', async () => {
    await request(app)
    .patch('/api/users')
    .send({
        name: 'Hussein'
    })
    .expect(401)
})

//Delete

test('Should delete account for user', async () => {
    await request(app)
        .delete('/api/users')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    //check that user got deleted from DB
    const user = await User.findById(userOneId)
    expect(user).toBeNull()

    //check that products/services/transactions related to deleted user got removed
    const product = await Product.findOne({owner: userOneId})
    expect(product).toBeNull()

    const service = await Service.findOne({owner: userOneId})
    expect(service).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/api/users')
        .send()
        .expect(401)
})
