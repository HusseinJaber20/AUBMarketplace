const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator/check')
ObjectId = require('mongodb').ObjectID;
const Transaction = require('../../models/Transaction')


//Get the transation 

//if transaction open update it with buyer id and close it
//else return server error