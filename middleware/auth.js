const jwt = require('jsonwebtoken')
const User = require('../models/User')

// This is a middleware
// When a request comes with a token in its header, what we really care
// about is the user id of the requester in the database and not the token
// because the id will give us access to his/her data
// This middleware validates the token and injects the user id into the request
// and send the request to the next middleware

module.exports = async(req,res,next) => {
    try {
        // Get Token from the header
        const token = req.header('Authorization').replace('Bearer ', '')

        // Check if no token in the request
        if(!token){
            return res.status(401).json({ msg : 'No Token, authorization denied!'})
        }
        
        // Verify the token , remember the token is a decrypted id     
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.user = decoded.user;
        
        next();
    } catch(err){
        console.log(err)
        res.status(401).json({ msg : 'Token is not valid!'})
    }
}