const express = require('express')
const router = express.Router();
const Product = require('../../models/Product')
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator')
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
router.get('/:id', auth, async(req,res) =>{
    try{
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(400).send({err: 'Product not found with such an id'})
        }
        res.send(product)
    } catch(err){
        res.status(400).send({err})
    }
})


// Update product by ID
router.patch('/:id', auth, async (req, res) => {
    // updates passed by the user
    const updates = Object.keys(req.body)
    // updates allowed to be made
    const allowedUpdates = ['description', 'name', 'category', 'status', 'price', 'currency', 'images', 'majors']
    // isValidOperation will be false if one of the requested updates is not valid
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //A user can only update a product he created
        const product = await Product.findOne({_id:req.params.id, owner: req.user.id})

        if(!product){
            return res.status(404).send()
        }
        
        //updating the product and saving it to the database
        updates.forEach((update) => product[update] = req.body[update])
        await product.save()

        res.send(product)
    } catch(e) {
        res.status(400).send(e)
    }
})

// Delete Product  
router.delete('/:id', auth, async (req,res) => {
    try {
        const product = await Product.findOne({_id: req.params.id, owner: req.user.id})
        if(!product){
            return res.status(404).send()
        }
        await product.remove()
        res.json({"message" : "Deleted Product Successfully"});
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


module.exports = router;