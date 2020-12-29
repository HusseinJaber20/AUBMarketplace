const express = require('express')
const router = express.Router();
const Service = require('../../../models/Service')
const FileUpload = require('../ImageUploader/file-upload')
const auth = require('../../../middleware/auth')

const singleUpload = FileUpload.upload.single('image')

// Uploads an image to Amazon S3 object store and stores the image's link in the service's images table.
router.post('/:id', auth,  async (req,res) => {
    singleUpload(req,res, async function(err){
        if(err){
            return res.json({'error' : err})
        }
        const service = await Service.findOne({_id:req.params.id})
        service.images.push(req.file.location)
        await service.save()
        return res.json({'imageURL' : req.file.location})
    })
})

router.delete('/:serviceid/:imageURL', auth, async(req,res) => {
    try{
        const service = await Service.findOne({_id:req.params.postid})
        if(
            !service.owner == req.user.id
        ) {
            return res.status(401).json({err : "You are not the owner of the service"})
        }
        const s3 = FileUpload.s3
        const DeleteImage = FileUpload.DeleteImage
        const params = {
            Bucket: "aubmarketplace",
            Key: req.params.imageURL
        }
        DeleteImage(s3,params)
        res.status(201).json({Message : "Image Deleted Successfully"})
    } catch(err){
        res.status(401).json({err})
    } 
})

module.exports = router
