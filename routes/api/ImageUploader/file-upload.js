const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
 
aws.config.update({
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    region: 'eu-west-3'
})

const s3 = new aws.S3()
 
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'aubmarketplace',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'TESTING_META_DATA'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

const DeleteImage = async (s3,params) => {
  try {
    await s3.headObject(params).promise()
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
}

module.exports = {upload,s3,DeleteImage};