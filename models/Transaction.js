const mongoose = require('mongoose');
const Product = require('./Product');
const User = require('./User');

const TYPE = ['Product' , 'Service']

const TransactionSchema = new mongoose.Schema({
    buyer : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    },
    seller : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    },
    type : {
        type : String,
        enum : TYPE,
        require : true
    },
    item : {
        type : mongoose.Schema.Types.ObjectId,
        require : true,
    },
    open : {
        type: Boolean,
        default: true,
        required: true
    }
},
{
    timestamps: true
});

module.exports = Transaction = mongoose.model('Transaction', TransactionSchema);