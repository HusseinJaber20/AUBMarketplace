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
        token: jwt.sign({id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Bob',
    email: 'bob@mail.aub.edu',
    password: 'bob.123',
    number: 123456,
    major: 'CCE',
    interests: ['circuits'],
    tokens: [{
        token: jwt.sign({id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const serviceOne = {
    _id: new mongoose.Types.ObjectId(),
    name: 'service1',
    description: 'first service',
    category: 'Teaching Assistant',
    salary: 5000,
    majors: ['CSE'],
    owner: userOne._id
}

const serviceTwo = {
    _id: new mongoose.Types.ObjectId(),
    name: 'service2',
    description: 'Second service',
    category: 'Other',
    salary: 10000,
    majors: ['CCE', 'ECE'],
    owner: userOne._id
}

const serviceThree = {
    _id: new mongoose.Types.ObjectId(),
    name: 'service3',
    description: 'Third service',
    category: 'Other',
    salary: 15000,
    majors: ['CCE', 'ECE'],
    owner: userTwo._id
}

const productOne = {
    _id: new mongoose.Types.ObjectId(),
    name: 'CLRS',
    description: 'good quality',
    category: 'Book',
    price: 5000,
    majors: ['CSE', 'CCE'],
    owner: userOne._id 
}

const productTwo = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Sabah book',
    description: 'good quality',
    category: 'Book',
    price: 5000,
    majors: ['ECE'],
    owner: userTwo._id 
}

const productThree = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Calculator',
    description: 'Needs batteries',
    category: 'Electronics',
    price: 5000,
    majors: ['CCE', 'ECE', 'CSE'],
    owner: userTwo._id 
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Service.deleteMany()
    await Product.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Service(serviceOne).save()
    await new Service(serviceTwo).save()
    await new Service(serviceThree).save()
    await new Product(productOne).save()
    await new Product(productTwo).save()
    await new Product(productThree).save()
}

module.exports = {
    userOneId, userOne,
    userTwoId, userTwo,
    serviceOne, serviceTwo, serviceThree,
    productOne, productTwo, productThree,
    setupDatabase
}