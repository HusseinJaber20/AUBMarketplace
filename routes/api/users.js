const express = require('express')
const router = express.Router();

// @route  GET api/users
// @desc   Test route
// @acess  Public

// localhost5000/api/user/id
router.get('/', (req,res) => res.send('User route'));

module.exports = router;