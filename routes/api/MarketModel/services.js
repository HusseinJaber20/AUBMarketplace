const express = require('express')
const User = require('../../../models/User')
const Service = require('../../../models/Service')
const Transaction = require('../../../models/Transaction')
const auth = require('../../../middleware/auth')
const {sendApplicationEmail} = require('../../../emails/account')

const router = express.Router();

//Apply to fulfill a service
router.post('/apply/:id', auth, async (req, res) => {
    try{ 
        const service = Service.findById(req.params.id)
        if(!service){
            return res.status(404).send('Could not find service')
        }
        if(service.owner == req.user.id || service.status != 'Available'){
            return res.status(400).send('You cannot apply to this service')
        }

        const transaction = {
            owner: service.owner,
            applicant: req.user.id,
            service: req.params.id
        }
        await new Transaction(transaction).save()

        const applicant = await User.findById(req.user.id)
        const serviceOwner = await User.findById(service.owner)
        sendApplicationEmail(serviceOwner.email, serviceOwner.name, applicant.name)
    } catch(e) {
        res.status(500).send(e)
    }
})

//Mark service as fulfilled
router.patch('/fulfill/:id', auth, async (req, res) =>{
    try {
        const service = Service.findOne({_id:req.params.id, owner:req.user.id})
        if(!service){
            return res.status(401)
        }
    } catch(e) {

    }
})

//Read all users who applied to specific service

//Read all services whom a user applied to

module.exports = router;