const express = require('express')
const router = express.Router();
const {check, validationResult} = require('express-validator')
const User = require('../../models/User')
//Used for validating the User
const jwt = require('jsonwebtoken')
//sending emails
const {sendWelcomeEmail, sendCancellationEmail} = require('../../emails/account')
const auth = require('../../middleware/auth')

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

        await user.save();
        sendWelcomeEmail(user.email, user.name)

        const payload = {
            user : {
                id: user._id
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
                res.status(201).json({token});
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
        await user.remove()
        sendCancellationEmail(user.email, user.name)
        res.json({"message" : "Deleted User Successfully"});
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


// Update User
router.patch('/', auth, async (req, res) => { 
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'number', 'location', 'major', 'interests']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const user = await User.findById(req.user.id)

        if(!user){
            return res.status(404).send()
        }

        updates.forEach( (update) => user[update] = req.body[update]) //dynamic
        await user.save()

        res.send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})


// Read/View user profile by id
router.get('/:id', auth, async(req,res) =>{
    try{
        const user = await User.findById(req.params.id).select('-password').select('-tokens')
        res.send(user)
    } catch(err){
        res.status(400).send({err: 'User not found with such a token'})
    }
})

router.patch('/rate/:id/:number', auth, async(req,res) => {
    try {
        rating = parseInt(req.params.number)
        if(rating<0 || rating>5){
            return res.status(400).send({'err' : 'Rating should be between 0 and 5 inclusive'})
        }
        const user = await User.findById(req.params.id)
        if(user.rate[0] == -1){ // -1 means the user has neven been rated before
            user.rate[0] = 0;
        }
        updatedRate = [user.rate[0]+1, user.rate[1] + rating]
        user.rate = updatedRate
        await user.save()
        return res.status(200).send({'Rate' : updatedRate[1] / updatedRate[0]})
    } catch(err){
        res.status(400).send(err)
    }
})





module.exports = router;