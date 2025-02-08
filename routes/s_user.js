const express = require('express')
const router = express.Router()

const { isValid_a_User, isValid_s_User } = require('../helper/authHelper')
const { craeteSUser_a, getSUserDetails_a, deleteSUser_a, resetPasswordSUser_a, getData_s, getAssetData_s, updateProfileData_s, changePassword_s } = require('../controller/s_user')
const { isValidPlan, isValidPlan_s } = require('../helper/planValidator')


// Create S-User by A-user
router.post('/new', [isValid_a_User, isValidPlan], craeteSUser_a)
// GET All Sub-User for each A-user
router.post('/get_s_user_details', [isValid_a_User, isValidPlan], getSUserDetails_a)
// Delete S-User from A-User
router.delete('/delete_s_user', isValid_a_User, deleteSUser_a)
// Reset Passowrd of S-USer in A-User Dash
router.patch('/resetpassword', isValid_a_User, resetPasswordSUser_a)


// ##################################### S-USER DASHBOARD ########################################

// GET User data
router.get("/get", [isValid_s_User, isValidPlan_s], getData_s)
// GET data of asset
router.get("/asset/get", [isValid_s_User, isValidPlan_s], getAssetData_s)
// Update profile data
router.patch("/update", isValid_s_User, updateProfileData_s)
// Update (Chnage) password
router.patch("/changepassword", isValid_s_User, changePassword_s)

module.exports = router