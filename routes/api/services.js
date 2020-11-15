const express = require('express')
const Service = require('../../models/Service')
const auth = require('../../middleware/auth')


const router = express.Router();


// Create Service
router.post('/', auth, async (req, res) => {
    // copy all the properties of req.body to the object
    // then hardcode the owner
    const service = new Service({
        ...req.body,
        owner: req.user._id
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
        await req.user.populate('services').execPopulate()
        res.send(req.user.services)
    } catch(e){
        res.status(500).send()
    }
})

// Read Service by ID
router.get('/:id', async (req, res) => {
    const _id = req.params.id
    
    try {
        const service = await Service.findById(_id)
        if(!service){  
            return res.status(404).send()
        }
        res.send(service)
    } catch(e) {
        res.status(500).send()
    }
})

/*
// Update Service by ID
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'status', 'category']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const service = await Service.findById(req.params.id)

        updates.forEach((update) => service[update] = req.body[update])
        await service.save()

        if(!service){
            return res.status(404).send()
        }
        res.send(service)
    } catch(e) {
        res.status(400).send(e)
    }
})

// Delete Service
router.delete('/:id', async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id)
        if(!service){
            res.status(404).send()
        }
        res.send(service)
    } catch(e) {
        res.status(500).send()
    }
})

*/


module.exports = router;
