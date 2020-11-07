const express = require('express')
const router = express.Router();
const Product = require('../../models/Product')
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator/check')

// @route  Post api/posts
// @desc   Post about a product
// @acess  Public

router.post('/', auth, [
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
        res.json({ msg : "Product saved successfully!"})
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

module.exports = router;