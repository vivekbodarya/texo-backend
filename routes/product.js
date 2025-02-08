const express = require('express')
const router = express.Router()

const { isValid_s_User } = require('../helper/authHelper')
const { createProduct_s, getproductByAsset_s, updateProductHomeDetail_s, deleteProduct_s } = require('../controller/product')
const { isValidPlan_s } = require('../helper/planValidator')


// Craete product
router.post('/s_user/create', isValid_s_User, createProduct_s)
// GET --- Get product data by asset id
router.post("/s_user/get/:id", [isValid_s_User, isValidPlan_s], getproductByAsset_s)
// Update home product detail -- name and how many machine work
router.patch("/s_user/update/home", isValid_s_User, updateProductHomeDetail_s)
// DELETE - product
router.delete("/s_user/delete", isValid_s_User, deleteProduct_s)


module.exports = router