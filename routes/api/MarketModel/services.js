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
        const service = await Service.findById(req.params.id)
        if(!service){
            return res.status(404).send('Could not find service')
        }

        if(service.owner == req.user.id){
            return res.status(400).send('You cannot apply to your own service')
        }
        if(service.status !== 'Available'){
            return res.status(400).send('Service not available')
        }

        const transactionBody = {
            owner: service.owner,
            applicant: req.user.id,
            service: req.params.id
        }

        //check if user already applied to service
        const potentialTransaction = await Transaction.findOne(transactionBody)
        if(potentialTransaction){
            return res.status(400).send('You already applied to this service')
        }
        
        try{
            
            const applicant = await User.findById(req.user.id)
            const serviceOwner = await User.findById(service.owner)
            const transaction = await new Transaction(transactionBody)
            await transaction.save()

            sendApplicationEmail(serviceOwner.email, serviceOwner.name, applicant.name)
                
            res.status(201).send(transaction)

        }catch(e){
            res.status(500).send(e)
        }

    } catch(e) {
        res.status(500).send(e)
    }
})

//Mark service as fulfilled
router.patch('/fulfill/:id', auth, async (req, res) =>{
    try {
        const service = await Service.findOne({_id:req.params.id, owner:req.user.id})
        if(!service){
            return res.status(404).send()
        }
        await Transaction.deleteMany({service: service._id, open: true})     
        service.status = 'Fulfilled'
        await service.save()   
        res.status(200).send(service)

    } catch(e) {
        res.status(500).send(e)
    }
})

//Mark transaction as closed [meaning that a user was accepted to fulfill the service]
router.patch('/accept/:id', auth, async (req, res) =>{
    try {
        const transaction =  await Transaction.findOne({_id: req.params.id, owner: req.user.id})
        if(!transaction){
            return res.status(404).send()
        }

        transaction[open] = false

        await transaction.save()
        res.status(200).send(transaction)

    } catch(e) {
        res.status(500).send(e)
    }
})

//Read all users who applied to specific service
router.get('/applicants/:id', auth, async (req, res) => {
    try {
        const service = await Service.findOne({_id:req.params.id, owner:req.user.id})
        if(!service){
            return res.status(404).send()
        }
        await service.populate('applicants').execPopulate()
        res.send(service.applicants)
    } catch(e){
        res.status(500).send()
    }
})

//Read all users who fulfilled a specific service
router.get('/fulfillers/:id', auth, async (req, res) => {
    try {
        const service = await Service.findOne({_id:req.params.id, owner:req.user.id})
        if(!service){
            return res.status(404).send()
        }
        await service.populate('applicants').execPopulate()
        var fulfillers = []

        service.applicants.forEach(transaction => {
            transaction.open === false ? fulfillers.push(transaction) : fulfillers = fulfillers
        })

        res.send(fulfillers)
    } catch(e){
        res.status(500).send()
    }
})

//Read all services that a user applied to
router.get('/applications', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).send()
        }
        await user.populate('applications').execPopulate()
        res.send(user.applications)

    } catch(e) {
        res.status(500).send()
    }
})

//Read a user's history [all the services he fulfilled]
router.get('/history', auth, async (req, res) => {
    try{
        const transactions = await Transaction.find({applicant: req.user.id, open: false})
        
        res.send(transactions)

    }catch(e){
        res.status(500).send()
    }
})

//delete application of user
router.delete('/applications/:id', auth, async (req, res) => {
    try{
        const transaction = await Transaction.findOne({_id: req.params.id, applicant: req.user.id})
       
        if(!transaction){
            return res.status(404).send()
        }

        await transaction.remove()
        res.status(200).send('Transaction deleted successfully')

    }catch(e){
        res.status(500).send()
    }
})


module.exports = router;