const express = require('express')
const router = express.Router();
const Service = require('../../../models/Service')
const upload = require('../ImageUploader/file-upload')
const auth = require('../../../middleware/auth')

const singleUpload = upload.single('image')

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

module.exports = router
