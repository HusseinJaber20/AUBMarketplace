const request = require('supertest')
const app = require('../app')
const Service = require('../models/Service')
const {     
    userOneId, userOne,
    userTwoId, userTwo,
    serviceOne, serviceTwo, serviceThree,
    setupDatabase 
    } = require('./fixtures/db')

beforeEach(setupDatabase)

// List of tests
/*
    //Create
    Should create service for user
    Should not create service for unauthenticated user
    Should not create service with invalid/missing field
    //Read
    Should fetch user services
    Should fetch service by ID
    //Update
    Should update user service
    Should not update user service if aunauthenticated
    Should not update service with invalid field
    Should not update other users service
    //Delete
    Should delete user service
    Should not delete service if unauthenticated
    Should not delete other users services
*/

//Create

test('Should create service for user', async () => {
    const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'EECE230 TA',
            description: 'TA must be passionate, and has an 80+ one EECE230',
            category: 'Teaching Assistant',
            salary: 15000,
            majors: ['CSE', 'CCE', 'ECE'],
        })
        .expect(201)
    
    const service = await Service.findById(response.body._id)
    expect(service).not.toBeNull()
    expect(service.status).toEqual('Available')
    expect(service.currency).toEqual('LBP')
})

test('Should not create service for unauthenticated user', async () => {
    await request(app)
        .post('/api/services')
        .send({
            name: 'EECE230 TA',
            description: 'TA must be passionate, and has an 80+ one EECE230',
            category: 'Teaching Assistant',
            salary: 15000,
            majors: ['CSE', 'CCE', 'ECE'],
        })
        .expect(401)
})

test('Should not create service with invalid/missing field', async () => {
    //invalid field
    await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            title: 'EECE230 TA',
            description: 'TA must be passionate, and has an 80+ one EECE230',
            category: 'Teaching Assistant',
            salary: 15000,
            majors: ['CSE', 'CCE', 'ECE'],
        })
        .expect(400)
    
    //missing field name
    await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'TA must be passionate, and has an 80+ one EECE230',
            category: 'Teaching Assistant',
            salary: 15000,
            majors: ['CSE', 'CCE', 'ECE'],
        })
        .expect(400)
})

//Read

test('Should fetch user services', async () => {
    const response = await request(app)
        .get('/api/services')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.length).toEqual(2)
})

test('Should fetch service by ID', async () => {
    const response = await request(app)
        .get(`/api/services/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body._id).toBe((serviceOne._id).toString())
})

//Update

test('Should update user service', async () => {
    const response = await request(app)
        .patch(`/api/services/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'New Name'
        })
        .expect(200)
    
    const service = await Service.findById(serviceOne._id)
    expect(service.name).toBe('New Name')
})


test('Should not update user service if aunauthenticated', async () => {
    await request(app)
        .patch(`/api/services/${serviceOne._id}`)
        .send({
            name: 'New Name'
        })
        .expect(401)
    
    const service = await Service.findById(serviceOne._id)
    expect(service.name).toBe(serviceOne.name)
})


test('Should not update service with invalid field', async () => {
    await request(app)
        .patch(`/api/services/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            field: 'bad field'
        })
        .expect(400)
})

test('Should not update other users service', async () => {
    const response = await request(app)
        .patch(`/api/services/${serviceThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'New Name'
        })
        .expect(404)
})

//Delete

test('Should delete user service', async () => {
    await request(app)
        .delete(`/api/services/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const service = await Service.findById(serviceOne._id)
    expect(service).toBeNull()
})

test('Should not delete service if unauthenticated', async () => {
    await request(app)
        .delete(`/api/services/${serviceOne._id}`)
        .send()
        .expect(401)
    
    const service = await Service.findById(serviceOne._id)
    expect(service).not.toBeNull()
})

test('Should not delete other users services', async () => {
    await request(app)
        .delete(`/api/services/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    
    const service = await Service.findById(serviceOne._id)
    expect(service).not.toBeNull()
})


