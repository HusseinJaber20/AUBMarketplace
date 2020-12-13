const express = require('express')
const router = express.Router();
const Product = require('../../models/Product')
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator/check')
ObjectId = require('mongodb').ObjectID;


// Create a product
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
    
    product = new Product ({
        ...req.body,
        owner: req.user.id
    })

    try{
        await product.save();
        res.status(201).send(product)        
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
});


// Read all products made by user
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        await user.populate('products').execPopulate()
        res.send(user.products)
    } catch(e){
        res.status(500).send()
    }
})

// Read single product by id


// Update product

// Delete Product  
router.delete('/:id', auth, async (req,res) => {
    try {
        const product = await Product.findOneAndDelete({_id: req.params.id, owner: req.user.id})
        if(!product){
            return res.status(404).send()
        }
        res.json({"message" : "Deleted Product Successfully"});
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

module.exports = router;