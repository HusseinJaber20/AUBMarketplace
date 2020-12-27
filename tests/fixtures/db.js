const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../models/User')
const Product = require('../../models/Product')
const Service = require('../../models/Service')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'John',
    email: 'john@mail.aub.edu',
    password: 'johnDoe.123',
    number: 12345678,
    major: 'CSE',
    interests: ['programming', 'math'],
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const setupDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

module.exports = {
    userOneId,
    userOne,
    setupDatabase
}