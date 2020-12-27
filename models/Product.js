const mongoose = require('mongoose')
const FileUpload = require('../routes/api/ImageUploader/file-upload')

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
    majors: {
        type: [],
        required: true,
        index: true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
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
    images.forEach(async image => {
        params.Key = image.substr(image.length - 13)
        try {
            await s3.headObject(params).promise()
            console.log("File Found in S3")
            try {
                await s3.deleteObject(params).promise()
                console.log("file deleted Successfully")
            }
            catch (err) {
                 console.log("ERROR in file Deleting : " + JSON.stringify(err))
            }
        } catch (err) {
                console.log("File not Found ERROR : " + err.code)
        }
    })
    next()
})

// You can think of a model as a constructor. It will be used too to query from the DB.
module.exports = Product = mongoose.model('Product', ProductSchema);