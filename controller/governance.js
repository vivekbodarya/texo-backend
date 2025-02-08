const bcrypt = require('bcrypt')
const governanceAuth = require("../models/governance/governanceAuth")
const jwt = require('jsonwebtoken');
const logintoken = require('../models/users/logintoken');
const user = require('../models/users/a_user');
const { default: mongoose } = require('mongoose');
const s_user = require('../models/users/s_user');
const plan = require('../models/plan/plan');
const key = process.env.ATOKEN_KEY;

const saltRounds = 12





// const salt = bcrypt.genSaltSync(12);
// const hash = bcrypt.hashSync("", salt);
// console.log(hash)






// Auth 1
const auth_g = async (req, res, next) => {
    const body = req.body
    await governanceAuth.findOne({ $and: [{ userEmail: String(body.userEmail) }, { isActive: true }] })
        .then(result => {
            if (result != null) {
                const checkPasswordStatus = bcrypt.compareSync(String(body.userPassword), result.userPassword)
                // Check password is mactch or not
                if (checkPasswordStatus !== true) {
                    return res.status(301).json({
                        message: "Invalid authentication.",
                    })
                }
                res.status(200).json({
                    message: "Login1 succ..",
                })
            }
        })
        .catch(err => {
            res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
        })
}


// Auth 2
const auth2_g = async (req, res, next) => {
    const body = req.body

    await governanceAuth.findOne({ $and: [{ userEmail: String(body.userEmail) }, { isActive: true }] })
        .then(result => {
            if (result != null) {
                const checkPasswordStatus = bcrypt.compareSync(String(body.userPassword), result.userPassword)
                const checkPinStatus = bcrypt.compareSync(String(body.userPin), result.userPin)
                // Check password is mactch or not
                if (checkPasswordStatus !== true || checkPinStatus !== true) {
                    return res.status(301).json({
                        message: "Invalid authentication.",
                    })
                }

                const token = jwt.sign(
                    { userId: result._id, userEmail: result.userEmail },
                    key,
                    { expiresIn: "7d" }
                )

                logintoken.findOne({ userId: result._id }, (err, user) => {
                    if (user) {
                        logintoken.updateOne({ _id: user._id }, { $set: { onModel: 'governances', token: token, user_type: result.role } })
                            .then((success) => {
                                res.status(200).json({
                                    message: "Login succ..",
                                    token: token,
                                    isAuth: true,
                                    admin: "admin",
                                    key: true,
                                })
                            })
                    } else {
                        const new_user = new logintoken({
                            _id: mongoose.Types.ObjectId(),
                            userId: result._id,
                            onModel: 'users',
                            token: token,
                            user_type: result.role
                        })
                        new_user.save()
                            .then((ress) => {
                                res.status(200).json({
                                    message: "Login succ..",
                                    token: token,
                                    isAuth: true,
                                    admin: "admin",
                                    key: true,
                                })
                            })
                            .catch(err => {
                                // console.log(err)
                                res.status(301).json({ message: "Opps! Somthing went wrong1.", result: "something went wrong on save" })
                            })
                    }
                })
            }
        })
        .catch(err => {
            // console.log(err)
            res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
        })
}





// USER GET DATA
const userData = async (req, res, next) => {

    governanceAuth.findOne({ _id: req.userData.userId })
        .select("-userPassword -userPin")
        .then(result => {
            res.status(200).json({
                message: "success",
                data: result
            })
        })
        .catch((err) => {
            // console.log(err)
            res.status(301).json({
                message: "err",
                data: err
            })
        })
}

// A-USER GET DATA
const getAuserAllData = async (req, res, next) => {
    user.find()
        .populate("activePlan planHistory.oldPlan")
        .select("-userPassword")
        .then(result => {
            res.status(200).json({
                message: "success",
                data: result
            })
        })
        .catch((err) => {
            res.status(301).json({
                message: "err",
                data: err
            })
        })
}

// S-USER GET DATA
const getSuserAllData = async (req, res, next) => {
    s_user.find()
        .select("-userPassword")
        .then(result => {
            res.status(200).json({
                message: "success",
                data: result
            })
        })
        .catch((err) => {
            // console.log(err)
            res.status(301).json({
                message: "err",
                data: err
            })
        })
}

const getAllPlansData = async (req, res, next) => {
    plan.find()
        .then(result => {
            res.status(200).json({
                message: "success",
                data: result
            })
        })
        .catch((err) => {

            res.status(301).json({
                message: "err",
                data: err
            })
        })
}

// Add plan to user
const addPlan_a_user_admin = async (req, res, next) => {
    const body = req.body
    try {
        await plan.findById({ _id: String(body.data) })
            .exec()
            .then(result => {
                var d = new Date();
                var start = d.toLocaleString("en-US", "Asia/Delhi")
                d.setDate(d.getDate() + Number(result.planDays))
                var end = d.toLocaleString("en-US", "Asia/Delhi")

                // find user and update
                user.updateOne({ $and: [{ _id: String(body.userId) }, { userEmail: String(body.userEmail) }] }, {
                    $set: {
                        activePlan: result._id,
                        activePlan_start: start,
                        activePlan_end: end,
                        isActive: true,
                    },
                    $push: {
                        planHistory: {
                            oldPlan: result._id,
                            startDate: start,
                            endDate: end
                        }
                    }
                })
                    .exec()
                    .then(ress => {
                        plan.updateOne({ _id: result._id }, { $inc: { noTimeUsedPlan: 1 } })
                        res.status(200).json({
                            message: "success",
                            data: result
                        })
                    })
                    .catch((err) => {
                        res.status(301).json({ message: "err", data: err })
                    })
            })
            .catch(err => {
                res.status(301).json({ message: "err", data: err })
            })
    } catch (e) {
        res.status(301).json({ message: "err", data: e })
    }
}

// reset a-user Password
const resetPassword_auser_admin = async (req, res, next) => {
    const body = req.body
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hashSync("BBtexosoft@123", salt);
    await user.updateOne({ $and: [{ _id: String(body.id) }, { userEmail: String(body.userEmail) }] }, {
        $set: { userPassword: hash }
    })
        .then(result => {
            res.status(200).json({
                message: "success",
                data: result
            })
        })
        .catch(err => {
            res.status(301).json({
                message: "err",
                data: err
            })
        })
}


// add new plan
const addnewPlan_g = async (req, res, next) => {
    const body = req.body
    const new_plan = await new plan({
        _id: mongoose.Types.ObjectId(),
        planName: String(body.planName),
        planCode: String(body.plancode),
        planPrice: String(body.planPrice),
        planDays: String(body.planDays),
        accessAssets: String(body.assetAccess),
        looms: String(body.looms),
        backup: String(body.backup),
        offer: String(body.offer),
        typeofPlan: String(body.typeofplan),
    })
    await new_plan.save()
        .then((ress) => {
            res.status(200).json({
                message: "User Login Success",
                result: ress
            })
        })
        .catch((err) => {
            res.status(401).json({
                message: err
            })
        })
}


// Update new plan
const updatenewPlan_g = async (req, res, next) => {
    const body = req.body
    plan.findByIdAndUpdate({ _id: body.id }, { $set: { typeofPlan: String(body.typeofPlan), offer: String(body.offer) } })
        .then(result => {
            res.status(200).json({
                message: "User Login Success",
                result: result
            })
        }).catch((err) => {
            res.status(401).json({
                message: err
            })
        })
}


// Block A-User
const blockUser_admin = async (req, res, next) => {
    const body = req.body
    await user.updateOne({ _id: body.id }, { $set: { isActive: body.isActive } })
        .then(result => {
            res.status(200).json({
                message: "User Login Success",
                result: result
            })
        })
        .catch(err => {
            res.status(301).json({
                message: "err",
                data: err
            })
        })
}


// LOGOUT ADMIN
const logout_gov = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    await logintoken.deleteOne({ token: token })
        .then(() => {
            res.status(200).json({ message: "Logout Succ" })
        })
        .catch(() => {
            res.status(404).json({ message: "Logout Succ" })
        })
}
module.exports = { auth_g, auth2_g, userData, getAuserAllData, getSuserAllData, getAllPlansData, addPlan_a_user_admin, resetPassword_auser_admin, addnewPlan_g, updatenewPlan_g, logout_gov, blockUser_admin }


