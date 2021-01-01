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

test('Should request a product', async () => {
    
})