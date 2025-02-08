const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../../models/users/a_user')
const SUser = require('../../models/users/s_user')
const jwt = require('jsonwebtoken')
const logintoken = require('../../models/users/logintoken')
const { default: mongoose } = require('mongoose')

const key = process.env.TOKEN_KEY;

router.post('/logE', async (req, res, next) => {
    const userRole = []
    const userEmail = String(req.body.userEmail)
    await User.findOne({ userEmail: userEmail })
        .then((result) => {
            if (result != null) {
                userRole.push('a_user')
            }
        })

    await SUser.findOne({ userEmail: userEmail })
        .then((result) => {
            if (result != null) {
                userRole.push('s_user')
            }
        })
    if (userRole.length > 1) {
        res.status(200).json({
            message: "Select role",
            role: userRole
        })
    }
    else if (userRole.length == 1) {
        res.status(200).json({
            message: "Select role",
            role: userRole
        })
    }
    else if (userRole.length == 0) {
        res.status(301).json({
            message: "User not found!",
        })
    }

})

router.post('/log2', async (req, res, next) => {
    const body = req.body
    switch (body.role) {
        case "a_user":
            User.findOne({ $and: [{ userEmail: String(body.userEmail) }, { isAdmin: body.role }] })
                .exec()
                .then((result) => {
                    // console.log(result, "result");
                    const checkPasswordStatus = bcrypt.compareSync(String(body.userPassword), result.userPassword)
                    // Check password is mactch or not
                    if (checkPasswordStatus !== true) {
                        return res.status(301).json({
                            message: "Invalid authentication.",
                        })
                    }
                    // generate token 
                    const token = jwt.sign(
                        { userId: result._id, userEmail: result.userEmail },
                        key,
                        { expiresIn: "7d" }
                    )
                    // console.log(token, "token");
                    // user data alarady in data base
                    // If user -> update details
                    // else -> create new user
                    logintoken.findOne({ userId: result._id }, (err, user) => {
                        if (user) {
                            logintoken.updateOne({ _id: user._id }, { $set: { onModel: 'users', token: token, user_type: body.role } })
                                .then((success) => {
                                    res.status(200).json({
                                        message: "Login succ..",
                                        token: token,
                                        isAuth: true,
                                        role: body.role
                                    })
                                })
                        } else {
                            const new_user = new logintoken({
                                _id: mongoose.Types.ObjectId(),
                                userId: result._id,
                                onModel: 'users',
                                token: token,
                                user_type: body.role
                            })
                            new_user.save()
                                .then((ress) => {
                                    res.status(200).json({
                                        message: "Login succ..",
                                        token: token,
                                        isAuth: true,
                                        role: body.role
                                    })
                                })
                                .catch(err => {
                                    res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                                })
                        }
                    })
                })
                .catch((err) => {
                    res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong", err: err })
                })
            break;

        case "s_user":
            SUser.findOne({ $and: [{ userEmail: String(body.userEmail) }, { isAdmin: body.role }] })
                .exec()
                .then((result) => {
                    const checkPasswordStatus = bcrypt.compareSync(String(body.userPassword), result.userPassword)
                    // Check password is mactch or not
                    if (checkPasswordStatus !== true) {
                        return res.status(301).json({
                            message: "Invalid authentication.",
                        })
                    }
                    // generate token 
                    const token = jwt.sign(
                        { userId: result._id, userEmail: result.userEmail },
                        key,
                        { expiresIn: "7d" }
                    )
                    // user data alarady in data base
                    // If user -> update details
                    // else -> create new user
                    logintoken.findOne({ userId: result._id }, (err, user) => {
                        if (user) {
                            logintoken.updateOne({ _id: user._id }, { $set: { onModel: 's_users', token: token, user_type: body.role } })
                                .then((success) => {
                                    res.status(200).json({
                                        message: "Login succ..",
                                        token: token,
                                        isAuth: true,
                                        role: body.role
                                    })
                                })
                        } else {
                            const new_user = new logintoken({
                                _id: mongoose.Types.ObjectId(),
                                userId: result._id,
                                onModel: 's_users',
                                token: token,
                                user_type: body.role
                            })
                            new_user.save()
                                .then((ress) => {
                                    res.status(200).json({
                                        message: "Login succ..",
                                        token: token,
                                        isAuth: true,
                                        role: body.role
                                    })
                                })
                                .catch(err => {
                                    res.status(301).json({ message: "Opps! Somthing went wrong.", result: err })
                                })
                        }
                    })
                })
                .catch((err) => {
                    res.status(301).json({ message: "Opps! Somthing went wrong.", result: err })
                })
            break;
        default:

    }
})

module.exports = router