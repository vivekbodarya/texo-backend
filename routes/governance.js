const express = require('express')
const { auth_g, auth2_g, userData, getAuserAllData, getSuserAllData, getAllPlansData, addPlan_a_user_admin, resetPassword_auser_admin, addnewPlan_g, updatenewPlan_g, logout_gov, blockUser_admin } = require('../controller/governance')
const { isAdmin } = require('../helper/authHelper')
const router = express.Router()


// ===================================== Governance ==========================================
// POST -- Auth1
router.post("/auth", auth_g)
// POST -- Auth1
router.post("/auth2", auth2_g)
// -------------------------------------------------

// GET USER DATA
router.get("/get", isAdmin, userData)
// GET ALL A-User data
router.get("/get/users", isAdmin, getAuserAllData)
router.get("/get/susers", isAdmin, getSuserAllData)
router.get("/get/plans", isAdmin, getAllPlansData)

// Update plan to user
router.patch("/add/plan", isAdmin, addPlan_a_user_admin)
// reset password of a-user
router.patch("/a_user/resetpasswords", isAdmin, resetPassword_auser_admin)
// Block User
router.patch("/a_user/block", isAdmin, blockUser_admin)
// Add new plan
router.post("/new/plan", isAdmin, addnewPlan_g)
// Update newplan
router.patch("/update/plan", isAdmin, updatenewPlan_g)
// logout
router.post("/logout", isAdmin, logout_gov)

module.exports = router