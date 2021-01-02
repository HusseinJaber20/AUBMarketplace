const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    },
    applicant : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    },
    service : {
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref: 'Service'
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