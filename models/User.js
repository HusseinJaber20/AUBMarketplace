const mongoose = require('mongoose')

// Each Schema in mongoose maps to a MongoDB collection and defines
// the shape of the documents within that collection.
// A collection in a NoSQL (MongoDB) is analogous to a table of an RDBMS
// A document in a collection is analogous to a row in a table of an RDBMS

// Link : https://mongoosejs.com/docs/guide.html

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    email : {
        type : String,
        required : true
    },
    password: {
        type : String,
        required : true
    },
    posts : {
        type : [],
        required: false
    }
});

// You can think of a model as a constructor. It will be used too to query from the DB.
module.exports = User = mongoose.model('users', UserSchema);