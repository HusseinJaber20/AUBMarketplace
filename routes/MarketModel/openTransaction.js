const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator/check')
ObjectId = require('mongodb').ObjectID;
const Transaction = require('../../models/Transaction')

// Create a transaction
router.post('/', auth, [
    check('seller','Seller is empty').not().isEmpty(),
    check('iype','Type is empty').not().isEmpty(),
    check('item','Item is empty').not().isEmpty()
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const {buyer, seller, type, item, open} = req.body;
    
    transaction = new Transaction ({
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