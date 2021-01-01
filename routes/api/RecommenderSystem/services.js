const express = require('express')
const Service = require('../../../models/Service')
const User = require('../../../models/User')
const auth = require('../../../middleware/auth')

const router = express.Router();

// get recommended services
router.get('/', auth, async (req,res) => {
    let services = await Service.find({ status : 'Available'}).sort({$natural: -1}).limit(100);
    let user = await User.findById(req.user.id)
    ret  = []
    services.forEach(service => {
        service.majors.includes(user.major) && service.owner!=req.user.id ? ret.push(service) : ret = ret
    })
    res.send(ret)
})

// get hottest services
router.get('/hottest', auth, async (req,res) => {
    let data = await Service.find({ status : 'Available'}).sort({$natural: -1}).limit(5);
    res.json({data})
})

// get newest services
router.get('/latest', auth, async (req,res) => {
    let data = await Service.find({ status : 'Available'}).sort({$natural: -1}).limit(10);
    res.json({data})
})


module.exports = router;
