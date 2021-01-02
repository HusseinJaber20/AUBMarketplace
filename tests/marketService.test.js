const request = require('supertest')
const app = require('../app')
const Transaction = require('../models/Transaction')
const Service = require('../models/Service')
const {     
    userOneId, userOne,
    userTwoId, userTwo,
    userThreeId, userThree,
    serviceOne, serviceTwo, serviceThree, serviceFour,
    transactionOne, transactionTwo, transactionThree,
    setupDatabase 
    } = require('./fixtures/db')

jest.mock('../emails/account')

beforeEach(setupDatabase)

//Apply

test('Should apply to fulfill a service', async () => {
    await request(app)
        .post(`/api/market/services/apply/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userThree.tokens[0].token}`)
        .send()
        .expect(201)
    
    transactionObject = {
        owner: userOneId,
        applicant: userThree,
        service: serviceOne._id
    }

    const transaction = await Transaction.findOne( transactionObject )
    expect(transaction).not.toBeNull()
})

test('Should not apply to service more than once', async () => {
    await request(app)
        .post(`/api/market/services/apply/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(400)
})

test('Should not apply to users own service', async () => {
    await request(app)
        .post(`/api/market/services/apply/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(400)
})

test('Should not apply to fulfilled service', async () => {
    await request(app)
        .post(`/api/market/services/apply/${serviceFour._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(400)
})

//Fulfill

test('Should mark service as fulfilled', async () => {
    const response = await request(app)
        .patch(`/api/market/services/fulfill/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const service = await Service.findById(serviceOne._id)
    expect(service.status).toEqual('Fulfilled')

    //make sure no more transactions related to it in the DB
    const transactions = await Transaction.find({service: serviceOne._id})
    expect(transactions.length).toBe(0)
})

test('Should not mark other users services as fulfilled', async () => {
    await request(app)
        .patch(`/api/market/services/fulfill/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    
    const service = await Service.findById(serviceOne._id)
    expect(service.status).toEqual('Available')

    const transactions = await Transaction.find({service: serviceOne._id})
    expect(transactions.length).not.toBe(0)
})

//Read applicants to service

test('Should get all applicants of specific service', async () => {
    const response = await request(app)
        .get(`/api/market/services/applicants/${serviceTwo._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.length).toBe(2)
})

test('Should not get applicants of other users service', async () => {
    await request(app)
        .get(`/api/market/services/applicants/${serviceOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
})

//Read user's applications

test('Should get a users applications', async () => {
    const response = await request(app)
        .get(`/api/market/services/applications`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.length).toBe(2)
})

test('Should not get applications for unauthenticated user', async () => {
    await request(app)
        .get(`/api/market/services/applications`)
        .send()
        .expect(401)
})

//Delete transaction

test('Should delete a users application (transaction)', async () => {
    await request(app)
        .delete(`/api/market/services/applications/${transactionOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
    
    const transaction = await Transaction.findOne({_id: transactionOne._id, applicant: userTwoId})
    expect(transaction).toBeNull()
})