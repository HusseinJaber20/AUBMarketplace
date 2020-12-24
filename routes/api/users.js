const express = require('express')
const router = express.Router();
const {check, validationResult} = require('express-validator/check')
const User = require('../../models/User')
const Product = require('../../models/Product')
const Service = require('../../models/Service')
//Used for validating the User
const jwt = require('jsonwebtoken')
//sending emails
const {sendWelcomeEmail, sendCancellationEmail} = require('../../emails/account')
//Used to encrypt,dcrypyt the password
const bcrypt = require('bcryptjs')
const auth = require('../../middleware/auth')


// Notes: - anything that returns a promise should have an await before or we can use .then() 
//        - express validator validates the req body
//        - bycrpt is used to hash the password

// @route  api/users
// @desc   Register a User
// @acess  Public

// Create a user
router.post('/', [
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min:6}),
    check('number', 'Please enter a valid phone number').isInt(),
    check('major', 'Please Enter a valid Major').not().isEmpty()
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    const {name, email, password, products,number,location,major,interests} = req.body;
    if(!email.endsWith("mail.aub.edu")){
        return res.status(400).json({ errors : [{ msg : 'Email is not an aub mail'}]});
    }
    
    try {
         // create a User
         user = new User({
             name,
             email,
             password,
             products,
             number,
             location,
             major,
             interests
         });
         // Encrypt the password
         const salt = await bcrypt.genSalt(10);
         user.password = await bcrypt.hash(password, salt);

         const payload = {
             user : {
                 id: user.id
             }
         }

         await user.save();
         sendWelcomeEmail(user.email, user.name)

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
        res.status(500).send({'Message': err.message})
    }
});

// Delete a User  
router.delete('/', auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id)
        await user.populate('products').execPopulate()
        await user.populate('services').execPopulate()
        // Delete all products offered by the user
        user.products.forEach(async (product) => {
            await Product.findOneAndDelete({_id: product._id, owner: req.user.id})
        })
        // Delete all services offered by the user
        user.services.forEach(async (service) => {
            await Service.findOneAndDelete({_id: service._id, owner: req.user.id})
        })
        // Delete user
        await user.remove()
        sendCancellationEmail(user.email, user.name)
        res.json({"message" : "Deleted User Successfully"});
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


// Update User

// Read/View user profile (HJ: Found in Auth.js)



module.exports = router;