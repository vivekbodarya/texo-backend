const express = require('express')
const router = express.Router()
const { isValid_s_User } = require('../helper/authHelper')
const { Addproduct_PL, updateProduct_PL } = require('../controller/pl_production')


// ===================================== Production ==========================================
// POST -- Add production
router.post("/add", isValid_s_User, Addproduct_PL)
// PATCh
router.patch("/update", isValid_s_User, updateProduct_PL)

module.exports = router