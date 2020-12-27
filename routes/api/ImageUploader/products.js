const express = require('express')
const router = express.Router();
const Product = require('../../../models/Product')
const FileUpload = require('../ImageUploader/file-upload')
const auth = require('../../../middleware/auth')

const singleUpload = FileUpload.upload.single('image')

// Uploads an image to Amazon S3 object store and stores the image's link in the product's images table.
router.post('/:id', auth,  async (req,res) => {
    singleUpload(req,res, async function(err){
        if(err){
            return res.json({'error' : err})
        }
        const product = await Product.findOne({_id:req.params.id})
        product.images.push(req.file.location)
        await product.save()
        return res.json({'imageURL' : req.file.location})
    })
})

module.exports = router
