const express = require('express')
const router = express.Router()


// Auth
const { isValid_a_User, isValid_s_User } = require('../helper/authHelper')
const { getAllAssets_a, createNewAsset_a, getDatabyIdAsset_a, updateAsset_a, updateSubUserForAsset_a, getAssetBySUser_s, deleteAssets_a_user } = require('../controller/assets')
const { isValidPlan, isValidPlan_s } = require('../helper/planValidator')



// -------------------------------------------------- A_USER -------------------------------------------------

// GET All assets of each A-user
router.get('/get', [isValid_a_User, isValidPlan], getAllAssets_a)
// Create New Assets
router.post('/new', [isValid_a_User, isValidPlan], createNewAsset_a)
// --------------------------------- Assets By ID -----------------------------
// GET 
router.get('/get/:id', [isValid_a_User, isValidPlan], getDatabyIdAsset_a)
// PATCH Assest
router.patch('/update', isValid_a_User, updateAsset_a)
// PATCH sub user for Asset by Id 
router.patch('/subuser_update', isValid_a_User, updateSubUserForAsset_a)
// Delete Asset
router.post('/delete', isValid_a_User, deleteAssets_a_user)


// ################################# S-User ########################################

// GET Asset by Id S-user
router.get('/s_user/get/:id', [isValid_s_User, isValidPlan_s], getAssetBySUser_s)




module.exports = router