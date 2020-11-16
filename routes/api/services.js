const express = require('express')
const Service = require('../../models/Service')
const User = require('../../models/User')
const auth = require('../../middleware/auth')

// @route  /api/services
// @desc   Test route
// @acess  Private

const router = express.Router();


// Create Service
router.post('/', auth, async (req, res) => {
    // copy all the properties of req.body to the object
    // then hardcode the owner
    const service = new Service({
        ...req.body,
        owner: req.user.id
    })

    try{
        await service.save()
        res.status(201).send(service)
    } catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

// Read all services made by user
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        await user.populate('services').execPopulate()
        res.send(user.services)
    } catch(e){
        res.status(500).send()
    }
})

// Read Service Made by User by ID
router.get('/:id', auth, async (req, res) => {
    const _id = req.params.id
    
    try {
        const service = await Service.findOne({_id, owner: req.user.id})

        if(!service){  
            return res.status(404).send()
        }
        res.send(service)
    } catch(e) {
        res.status(500).send()
    }
})

//Read Service made by OTHER user

// Update Service

// Delete Service


module.exports = router;
