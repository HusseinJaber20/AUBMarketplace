const express = require('express')
const router = express.Router();
const {check, validationResult} = require('express-validator/check')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')

// Notes: - anything that returns a promise should have an await before or we can use .then() 
//        - express validator validates the req body
//        - bycrpt is used to hash the password

// @route  POST api/users
// @desc   Register a User
// @acess  Public

router.post('/', [
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min:6}),
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    const {name, email, password} = req.body;
    if(!email.endsWith("mail.aub.edu")){
        res.status(400).json({ errors : [{ msg : 'Email is not an aub mail'}]});
    }
    
    try {
         // See if the user exists in the users document 
         let user = await User.findOne({email})
         if(user){
             res.status(400).json({ errors : [{ msg : 'User already exists'}]});
         }
         // create a User
         user = new User({
             name,
             email,
             password
         });
         // Encrypt the password
         const salt = await bcrypt.genSalt(10);
         user.password = await bcrypt.hash(password, salt);

         const payload = {
             user : {
                 id: user.id
             }
         }

         jwt.sign(
            payload,
            config.get('jwtSecret'), 
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