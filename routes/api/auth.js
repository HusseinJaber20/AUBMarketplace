const express = require('express')
const router = express.Router();
const {check, validationResult} = require('express-validator')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const auth = require('../../middleware/auth')
const bcrypt = require('bcryptjs')

// Authenticate user
router.get('/', auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// Login by Username and Password
router.post('/', [
    check('email','Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    const {email, password} = req.body;
    if(!email.endsWith("mail.aub.edu")){
        res.status(400).json({ errors : [{ msg : 'Email is not an aub mail'}]});
    }
    
    try {
         // See if the user exists in the users document 
         let user = await User.findOne({email})
         if(!user){
             return res.status(400).json({ errors : [{ msg : 'Invalid Credentials'}]});
         }

         // Check if the given password matches with that in the database
         const isMatch = await bcrypt.compare(password,user.password);
         if(!isMatch){
            return res.status(400).json({ errors : [{ msg : 'Invalid Credentials'}]});
         }

         const payload = {
             user : {
                 id: user.id
             }
         }

         jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            {expiresIn: 36000},
            (err,token) => {
                if(err){
                    throw err;
                }
                res.json({token});
            }
         )

    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
});


module.exports = router;