const mongoose = require('mongoose')
const FileUpload = require('../routes/api/ImageUploader/file-upload')

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
        index: true,
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
    majors : {
        type: [],
        required : true
    },
    owner: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    }
},{
    timestamps: true
});

//Middlewares
ServiceSchema.pre('remove', async function(next){
    const service = this
    const s3 = FileUpload.s3
    const params = {
        Bucket: "aubmarketplace",
        Key: "filename"
    }
    const images = service.images
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
module.exports = Service = mongoose.model('Service', ServiceSchema);