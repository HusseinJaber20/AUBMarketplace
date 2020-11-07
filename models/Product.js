const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    category : {
        type: String,
        enum : ['book', 'notes', 'supplies' , 'electronics','other'],
        default: 'other',
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
    images : {
        type : [],
        required : false
    },
    seller : {
        type : Number,
        required : true,
    },
    status : {
        type: String,
        enum : ['available' , 'sold'],
        default: 'available',
        required: true
    }
});

// You can think of a model as a constructor. It will be used too to query from the DB.
module.exports = User = mongoose.model('products', ProductSchema);