const express = require('express')
const Product = require('../../../models/Product')
const User = require('../../../models/User')
const auth = require('../../../middleware/auth')
const {sendRequestEmail} = require('../../../emails/account')

const router = express.Router();

//Request to buy a product 
router.patch('/buy/:id', auth, async(req,res) => {
    try{
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(400).send({err: 'Product not found with such an id'})
        }
        if(product.owner == req.user.id || product.status!='Available'){
            return res.status(400).send({err: 'You can not buy this product'})
        }
        product.status = 'Pending'
        product.candidate = req.user.id
        await product.save()
        const seller = await User.findById(product.owner)
        const buyer = await User.findById(req.user.id)
        sendRequestEmail(seller.email, seller.name, buyer.name)
        return res.status(201).json({Message: 'Request sent!'})
    } catch(err){
        return res.status(401).send({err})
    }
})

// Product sold after agreement with the buyer
router.patch('/sell/:id', auth, async(req,res) => {
    try{
        const product = await Product.findOne({_id:req.params.id, owner: req.user.id})
        if(!product){
            return res.status(401).send({Message : 'You have no such product'})
        }
        product.status = 'Sold'
        await product.save()
        return res.status(201).json({Message : 'Status Changed'})
    } catch(err){
        return res.status(401).send(err)
    }
})

// Rejects a request and makes the product available again
router.patch('/reject/:id', auth, async(req,res) => {
    try{
        const product = await Product.findOne({_id:req.params.id, owner: req.user.id})
        if(!product){
            return res.status(401).send({Message : 'You have no such product'})
        }
        if(product.status!= 'Pending'){
            return res.status(201).json({Message : 'Product already not pending!'})
        }
        product.status = 'Available'
        product.candidate = undefined
        await product.save()
        return res.status(201).json({Message : 'Status Changed'})
    } catch(err){
        return res.status(401).send(err)
    }
})

module.exports = router;