const express = require('express')
const Service = require('../../models/Service')
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator')

// @route  /api/services
// @desc   Test route
// @acess  Private

const router = express.Router();


// Create Service
router.post('/', auth, [
    check('name','Name is empty').not().isEmpty(),
    check('description','Description is empty').not().isEmpty(),
    check('salary','salary is empty').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
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

// Read Service by ID
router.get('/:id', auth, async (req, res) => {
    const _id = req.params.id
    
    try {
        const service = await Service.findById(_id)

        if(!service){  
            return res.status(400).send({err: 'Service not found with such an id'})
        }
        res.send(service)
    } catch(e) {
        res.status(500).send(e)
    }
})


// Update Service by ID
router.patch('/:id', auth, async (req, res) => {
    // updates passed by the user
    const updates = Object.keys(req.body)
    // updates allowed to be made
    const allowedUpdates = ['description', 'name', 'category', 'status', 'salary', 'currency', 'images', 'majors']
    // isValidOperation will be false if one of the requested updates is not valid
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //A user can only update a service he created
        const service = await Service.findOne({_id:req.params.id, owner: req.user.id})

        if(!service){
            return res.status(404).send()
        }
        
        //updating the service and saving it to the database
        updates.forEach((update) => service[update] = req.body[update])
        await service.save()

        res.send(service)
    } catch(e) {
        res.status(400).send(e)
    }
})


// Delete Service  
router.delete('/:id', auth, async (req,res) => {
    try {
        const service = await Service.findOne({_id: req.params.id, owner: req.user.id})
        if(!service){
            return res.status(404).send()
        }
        await service.remove()
        res.json({"message" : "Deleted Service Successfully"});
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


module.exports = router;
