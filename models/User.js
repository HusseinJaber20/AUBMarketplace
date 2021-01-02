const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Product = require('./Product')
const Service = require('./Service')
const Transaction = require('./Transaction')

// Each Schema in mongoose maps to a MongoDB collection and defines
// the shape of the documents within that collection.
// A collection in a NoSQL (MongoDB) is analogous to a table of an RDBMS
// A document in a collection is analogous to a row in a table of an RDBMS

const MAJOR = ['CCE' , 'CSE', 'ECE', 'ECON']

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true,
        trim: true
    },
    email : {
        type : String,
        required : true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type : String,
        required : true
    },
    number : {
        type : Number,
        required: true
    },
    location : {
        type : String,
        required : false
    },
    major : {
        type : String,
        enum : MAJOR,
        required: true
    },
    interests : {
        type : [String],
        validate: v => Array.isArray(v) && v.length > 0 
    },
    tokens: [{ //used to log out user from all his sessions
        token: {
            type: String,
            required: false //for now false, usually it should be true
        }
    }]
},
{
    timestamps: true
});

// a way for mongoose to figure out the relationship between user and tasks
// services will not be stored in db
UserSchema.virtual('services', {
    ref: 'Service',

    //where that local data is stored (ie relationship made by user._id)
    localField: '_id',

    //name of the field on the other object (ie Service)
    foreignField: 'owner' 
})

UserSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'owner' 
})

UserSchema.virtual('applications', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'applicant' 
})

//MIDDLEWARES
// Hash the plain text password before saving
UserSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    next()
})

//delete all services/products/tasks related to a user before deleting it
UserSchema.pre('remove', async function(next){
    const user = this
    await user.populate('products').execPopulate()
    user.products.forEach(async (product) => {
        await product.remove()
    })
    await user.populate('services').execPopulate()
    user.services.forEach(async (service) => {
        await service.remove()
    })
    await Transaction.deleteMany({owner: user._id})
    await Transaction.deleteMany({applicant: user._id})
    next()
})

// You can think of a model as a constructor. It will be used too to query from the DB.
module.exports = User = mongoose.model('User', UserSchema);