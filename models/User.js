const mongoose = require('mongoose')

// Each Schema in mongoose maps to a MongoDB collection and defines
// the shape of the documents within that collection.
// A collection in a NoSQL (MongoDB) is analogous to a table of an RDBMS
// A document in a collection is analogous to a row in a table of an RDBMS

// Link : https://mongoosejs.com/docs/guide.html

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

// a way for mongoose to figure the relationship between user and tasks
// services will not stored in db
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

// You can think of a model as a constructor. It will be used too to query from the DB.
module.exports = User = mongoose.model('User', UserSchema);