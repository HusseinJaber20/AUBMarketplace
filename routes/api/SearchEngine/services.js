const express = require('express')
const Service = require('../../../models/Service')
const auth = require('../../../middleware/auth')

const router = express.Router();

//Get services based on a search query
router.get('/', auth, async (req,res) => {
    try {
        let result = await Service.aggregate([
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
        ret = []
        result.forEach( product => {
            if(product.status == 'Available'){
                ret.push(product)
            }
        })
        res.send(ret);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
})


// Get Services with a specific category
router.get('/category/:category' , auth , async(req,res) => {
    try{
        let services = await Service.find({category : req.params.category, status : 'Available' }).sort({$natural: -1}).limit(10);
        res.send(services)
    } catch(err){
        res.status(400).send(err)
    }
})


module.exports = router;
