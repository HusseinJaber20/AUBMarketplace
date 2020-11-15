const mongoose = require('mongoose')


const ServiceSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim: true
    },
    category : {
        type: String,
        enum : ['Teaching Assistant', 'Research Assistant', 'Group Project', 'Full Time Job', 'Part Time Job', 'Task', 'Other'],
        default: 'Other',
        required: true
    },
    status : {
        type: String,
        enum : ['available' , 'fulfilled'],
        default: 'available',
        required: false
    },
    description : {
        type : String,
        required : true
    },
    salary : {
        type : Number,
        required : true
    },
    images : {
        type : [],
        required : false
    },
    applicants: {
        type: [], //users
        required: false
    },
    owner: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    }
});

// You can think of a model as a constructor. It will be used too to query from the DB.
module.exports = Service = mongoose.model('Service', ServiceSchema);