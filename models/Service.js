const mongoose = require('mongoose')

const CATEGORY = ['Teaching Assistant', 'Research Assistant', 'Group Project', 'Full Time Job', 'Part Time Job', 'Task', 'Other']
const STATUS = ['Available' , 'Fulfilled']
const CURRENCY = ['LBP', 'USD']

const ServiceSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim: true
    },
    category : {
        type: String,
        enum : CATEGORY,
        default: 'Other',
        required: true
    },
    status : {
        type: String,
        enum : STATUS,
        default: 'Available',
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
    currency: {
        type: String,
        enum: CURRENCY,
        default: 'LBP',
        required: true
    },
    images : {
        type : [],
        required : false
    },
    owner: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    }
});

// You can think of a model as a constructor. It will be used too to query from the DB.
module.exports = Service = mongoose.model('Service', ServiceSchema);