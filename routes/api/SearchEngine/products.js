const express = require('express')
const Product = require('../../../models/Product')
const auth = require('../../../middleware/auth')

const router = express.Router();

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

module.exports = router;
