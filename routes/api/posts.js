const express = require('express')
const router = express.Router();
const Product = require('../../models/Product')
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator/check')
ObjectId = require('mongodb').ObjectID;

// @route  Post api/posts
// @desc   Post about a product
// @acess  Public

router.post('/product', auth, [
    check('name','Name is empty').not().isEmpty(),
    check('description','Description is empty').not().isEmpty(),
    check('price','price is empty').not().isEmpty()
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const {name, category, price, description, status, images} = req.body;
    try{
        product = new Product ({
            name,
            category,
            price,
            description,
            seller : req.user.id,
            status,
            images,
        })
        await product.save();
        await User.updateOne({ _id : req.user.id}, {
            $push: { products: ObjectId(product.id) }
        })
        res.json({ msg : "Product saved successfully!"})
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

router.get('/product/hottest', auth, async (req,res) => {
    let data = await Product.find({}).sort({$natural: -1}).limit(5);
    res.json({data})
})

router.get('/product/latest', auth, async (req,res) => {
    let data = await Product.find({}).sort({$natural: -1}).limit(5);
    res.json({data})
})

router.get('/product/recommended', auth, async (req,res) => {
    let data = await Product.find({}).sort({$natural: -1}).limit(5);
    res.json({data})
})

module.exports = router;