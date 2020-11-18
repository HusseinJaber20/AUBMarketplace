const mongoose = require('mongoose')

const STATUS = ['Available' , 'Sold']
const CATEGORY = ['Book', 'Notes', 'Supplies' , 'Electronics', 'Other']
const CURRENCY = ['LBP', 'USD']

const ProductSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    category : {
        type: String,
        enum : CATEGORY,
        default: 'Other',
        required: true
    },
    description : {
        type : String,
        required : true
    },
    price : {
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
    status : {
        type: String,
        enum : STATUS,
        default: 'Available',
        required: true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    }
},{
    timestamps: true
});

// You can think of a model as a constructor. It will be used too to query from the DB.
module.exports = Product = mongoose.model('Product', ProductSchema);