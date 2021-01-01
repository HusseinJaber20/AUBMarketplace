const mongoose = require('mongoose')
const FileUpload = require('../routes/api/ImageUploader/file-upload')

const STATUS = ['Available' , 'Pending', 'Sold']
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
        index: true,
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
    majors: {
        type: [],
        required: true,
        index: true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    candidate : {
        type : mongoose.Schema.Types.ObjectId,
        required : false,
        ref: 'User',
    }
},{
    timestamps: true
});

//Middlewares
ProductSchema.pre('remove', async function(next){
    const product = this
    const s3 = FileUpload.s3
    const params = {
        Bucket: "aubmarketplace",
        Key: "filename"
    }
    const images = product.images
    const DeleteImage = FileUpload.DeleteImage
    images.forEach(async image => {
        params.Key = image.substr(image.length - 13)
        DeleteImage(s3,params)
    })
    next()
})

// You can think of a model as a constructor. It will be used too to query from the DB.
module.exports = Product = mongoose.model('Product', ProductSchema);