const express = require('express')
const Product = require('../../../models/Product')
const auth = require('../../../middleware/auth')

const router = express.Router();

// get recommended products
router.get('/', auth, async (req,res) => {
    let data = await Product.find({}).sort({$natural: -1}).limit(5);
    res.json({data})
})

// get hottest products
router.get('/hottest', auth, async (req,res) => {
    let data = await Product.find({}).sort({$natural: -1}).limit(5);
    res.json({data})
})

// get newest products
router.get('/latest', auth, async (req,res) => {
    let data = await Product.find({}).sort({$natural: -1}).limit(5);
    res.json({data})
})




module.exports = router;
