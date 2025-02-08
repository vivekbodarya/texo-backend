const express = require('express')
const { getAllPlanForUser, getAllPlanForUser_ } = require('../controller/plan')
const router = express.Router()


router.post('/get', getAllPlanForUser) //search
router.get('/allget', getAllPlanForUser_) //all


module.exports = router