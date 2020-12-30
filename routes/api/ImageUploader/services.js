const express = require('express')
const router = express.Router();
const Service = require('../../../models/Service')
const  {upload,s3,DeleteImage} = require('../ImageUploader/file-upload')
const auth = require('../../../middleware/auth')

const singleUpload = upload.single('image')

// Uploads an image to Amazon S3 object store and stores the image's link in the service's images table.
router.post('/:id', auth,  async (req,res) => {
    try{
        const service = await Service.findOne({_id:req.params.id, owner: req.user.id})
        if(!service){
            return res.status(401).json({err : "You are not the owner of the service"})
        }
        await singleUpload(req,res, async function(err){
            if(err){
                return res.json({'error' : err})
            }
            try{
                service.images.push(req.file.location)
                await service.save()
                return res.status(201).json({'imageURL' : req.file.location})
            }catch(err){
                res.status(401).json({err : "Couldn't find post"})
            }
        })
    } catch(err){
        res.status(401).json(err)
    }
})

router.delete('/:serviceid/:imageURL', auth, async(req,res) => {
    try{
        const service = await Service.findOne({_id:req.params.postid, owner: req.user.id})
        if(!service){
            return res.status(401).json({err : "You are not the owner of the service"})
        }
        const params = {
            Bucket: "aubmarketplace",
            Key: req.params.imageURL
        }
        await DeleteImage(s3,params)
        for(var i =0; i<service.images.length; i++){
            if(service.images[i].substr(service.images[i].length - 13) === req.params.imageURL){
                await service.images.splice(i,1)
                await service.save()
                break
            }
        }
        res.status(200).json({Message : "Image Deleted Successfully"})
    } catch(err){
        res.status(401).json({err})
    } 
})

module.exports = router
