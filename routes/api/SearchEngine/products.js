const express = require('express')
const Product = require('../../../models/Product')
const auth = require('../../../middleware/auth')

const router = express.Router();

//Get products based on a search query
router.get('/', auth, async (req,res) => {
    try {
        let result = await Product.aggregate([
            {
                "$search": {
                    "autocomplete": {
                        "query": `${req.query.query}`,
                        "path": "description",
                        "fuzzy": {
                            "maxEdits": 2,
                            "prefixLength": 3
                        }
                    }
                }
            }
        ])
        res.send(result);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
})

// Get Products with a specific category
router.get('/category/:category' , auth , async(req,res) => {
    try{
        let products = await Product.find({category : req.params.category , status : 'Available' }).sort({$natural: -1}).limit(10);
        res.send(products)
    } catch(err){
        res.status(400).send(err)
    }
})


module.exports = router;
