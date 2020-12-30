const express = require('express')
const router = express.Router();
const Product = require('../../../models/Product')
const {upload,s3,DeleteImage} = require('../ImageUploader/file-upload')
const auth = require('../../../middleware/auth')

const singleUpload = upload.single('image')

// Uploads an image to Amazon S3 object store and stores the image's link in the product's images table.
router.post('/:id', auth,  async (req,res) => {
    try{
        const product = await Product.findOne({_id:req.params.id, owner: req.user.id})
        if(!product){
            return res.status(401).json({err : "You are not the owner of the post"}) 
        }
        await singleUpload(req,res, async function(err){
            if(err){
                return res.json({'error' : err})
            }
            try{
                product.images.push(req.file.location)
                await product.save()
                return res.status(201).json({'imageURL' : req.file.location})
            } catch (err){
                res.status(401).json({err : "Couldn't find post"})
            }
        })
    } catch(err){
        res.status(401).json(err)
    }
})

router.delete('/:postid/:imageURL', auth, async(req,res) => {
    try{
        const product = await Product.findOne({_id:req.params.postid, owner: req.user.id})
        if(!product){
            return res.status(401).json({err : "You are not the owner of the post"})
        }

        const params = {
            Bucket: "aubmarketplace",
            Key: req.params.imageURL
        }
        await DeleteImage(s3,params)
        for(var i =0; i<product.images.length; i++){
            if(product.images[i].substr(product.images[i].length - 13) === req.params.imageURL){
                product.images.splice(i,1)
                await product.save()
                break
            }
        }
        res.status(200).json({Message : "Image Deleted Successfully"})
    } catch(err){
        res.status(401).json({err})
    } 
})

module.exports = router
