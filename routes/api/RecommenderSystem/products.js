const express = require('express')
const Product = require('../../../models/Product')
const User = require('../../../models/User')
const auth = require('../../../middleware/auth')

const router = express.Router();

// get recommended products
router.get('/', auth, async (req,res) => {
    let products = await Product.find({}).sort({$natural: -1}).limit(100);
    let user = await User.findById(req.user.id)
    ret  = []
    products.forEach(product => {
        product.majors.includes(user.major) ? ret.push(product) : ret = ret
    })
    res.send(ret)
})

// get hottest products
router.get('/hottest', auth, async (req,res) => {
    let data = await Product.find({}).sort({$natural: -1}).limit(5);
    res.json({data})
})

// get newest products
router.get('/latest', auth, async (req,res) => {
    let data = await Product.find({}).sort({$natural: -1}).limit(10);
    res.json({data})
})


module.exports = router;
