const bcrypt = require('bcrypt')
const User = require("../models/users/a_user") //a_user collection
const SUser = require('../models/users/s_user')
const Assets = require('../models/assets/assets')
// Power Looms Product
const PL_Product = require('../models/product/power_looms_product')
const { default: mongoose } = require('mongoose')
const plan = require('../models/plan/plan')



// Create New user
const newuser_a = async (req, res, next) => {
    await User.find({ userEmail: req.body.userEmail })
        .exec()
        .then((result) => {
            if (result.length < 1) {
                const saltRounds = 12
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(String(req.body.userPassword), salt);
                plan.findOne({ $and: [{ planCode: '0_0_0' }, { typeofPlan: 'new' }] })
                    .then(ress => {

                        var d = new Date();
                        var today = d.toLocaleString("en-US", "Asia/Delhi")
                        d.setDate(d.getDate() + Number(ress.planDays))
                        var next = d.toLocaleString("en-US", "Asia/Delhi")

                        const new_user = new User({
                            _id: mongoose.Types.ObjectId(),
                            userName: String(req.body.userName),
                            userEmail: String(req.body.userEmail),
                            userPhone: 0,
                            userPassword: hash,
                            userImgUrl: String(req.body.userImgUrl),
                            // create 7 days free plan
                            activePlan: ress._id,
                            activePlan_start: today,
                            activePlan_end: next,
                            isActive: true,
                            planHistory: [
                                {
                                    oldPlan: ress._id,
                                    startDate: today,
                                    endDate: next
                                }
                            ]
                        })
                        new_user.save()
                            .then((ress) => {
                                res.status(200).json({
                                    message: "User Login Success"
                                })
                            })
                            .catch((err) => {
                                res.status(401).json({
                                    message: err
                                })
                            })
                    })

            }
            else if (result.length === 1) {
                res.status(301).json({
                    message: "User Exist"
                })
            }
        })
}

// GEt user data
const getData_a = async (req, res, next) => {

    await User.findOne({ $and: [{ _id: req.userData.userId }, { userEmail: req.userData.userEmail }] }, { userPassword: 0 })
        .populate('activePlan planHistory.oldPlan')
        .exec()
        .then((result) => {
            if (result !== null) {
                res.status(200).json({
                    message: "success",
                    data: result
                })
            } else {
                res.status(404).json({
                    message: "Not Found",
                    data: result
                })
            }
        })
        .catch((err) => {
            // console.log(err)
            res.status(301).json({
                message: "err",
                data: err
            })
        })
}


// Update user data
const updateData_a = async (req, res, next) => {
    const body = req.body
    await User.updateOne({ _id: body._id }, { $set: { userName: String(body.userName), userPhone: Number(body.userPhone) } })
        .exec()
        .then((result) => {
            User.findById({ _id: body._id })
                .exec()
                .then((ress) => {
                    res.status(200).json({
                        message: "Updated",
                        result: ress
                    })
                })
        })
        .catch((err) => {
            res.status(301).json({
                message: "Something went wrong",
                result: err
            })
        })
}

// Chnage password

const chnagePassword_a = async (req, res, next) => {
    const body = req.body
    await User.findById({ _id: body._id })
        .exec()
        .then((result) => {
            const checkPasswordStatus = bcrypt.compareSync(body.a_oldPassword, result.userPassword)
            if (checkPasswordStatus === true) {
                const saltRounds = 12
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(body.a_newPassword, salt);
                User.updateOne({ _id: result._id }, { $set: { userPassword: hash } })
                    .exec()
                    .then((resultt) => {
                        if (resultt.matchedCount === 1 && (resultt.modifiedCount === 0 || resultt.modifiedCount === 1)) {
                            res.status(200).json({
                                message: "Password Updated",
                                result: "password updated"
                            })
                        }
                    })
            } else {
                res.status(304).json({
                    message: "Password not match",
                    result: "password_not_match"
                })
            }

        })
        .catch((err) => {
            res.status(301).json({
                message: "Something went wrong",
                result: "something went wrong"
            })
        })
}




module.exports = { newuser_a, getData_a, updateData_a, chnagePassword_a }