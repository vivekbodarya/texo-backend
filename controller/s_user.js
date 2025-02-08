const bcrypt = require('bcrypt')


const User = require('../models/users/a_user')
const SUser = require('../models/users/s_user')
const Assets = require('../models/assets/assets')

const CryptoJS = require('crypto-js')
const s_key = "V]$Bo=d#06@01"

const saltRounds = 12

// Create new s-user by A-suer
const craeteSUser_a = async (req, res, next) => {

    const body = req.body
    await SUser.find({ userEmail: body.s_userEmail })
        .exec()
        .then((result) => {
            if (result.length < 1) {
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(body.s_userPassword, salt);
                const new_user = new SUser({
                    userName: "NotFill",
                    userEmail: body.s_userEmail,
                    userPassword: hash,
                    userPhone: 0,
                    userImgUrl: body.s_userEmail[0],
                    a_user: body.a_user_
                })
                new_user.save()
                    .then((saveResult) => {
                        User.updateOne({ _id: body.a_user_ }, { $push: { s_user: saveResult._id } }, { userPassword: 0 }).exec()
                        res.status(200).json({
                            message: "Sub User Craeted Successfully!",
                            result: {
                                a_user: saveResult.a_user,
                                isAdmin: saveResult.isAdmin,
                                time: saveResult.time,
                                userEmail: saveResult.userEmail,
                                userPhone: saveResult.userPhone,
                                userImgUrl: saveResult.userImgUrl,
                                userName: saveResult.userName,
                                __v: saveResult.__v,
                                _id: saveResult._id
                            }
                        })
                    })
                    .catch((err) => {
                        res.status(201).json({
                            message: "Something went wrong!",
                            result: err
                        })
                    })
            } else {
                res.status(301).json({
                    message: "Something went wrong! Used email!",
                })
            }
        })
        .catch((err) => {
            res.status(501).json({
                message: "Something went wrong!",
                result: err
            })
        })
}

// GEt s-user details

const getSUserDetails_a = async (req, res, next) => {
    const body = req.body
    await User.findOne({ _id: body.data }, { s_user: 1, _id: 0 })
        .populate('s_user', { userPassword: 0 })
        .then((result) => {
            res.status(200).json({
                message: "success",
                result: result
            })
        })
        .catch((err) => {
            res.status(301).json({
                message: "err",
                result: err
            })
        })
}


// DELETE 
const deleteSUser_a = async (req, res, next) => {
    const body = req.body
    // console.log(body)
    await Assets.find({ s_user: body._id })
        .then((result) => {
            if (result.length == 0) {
                SUser.findByIdAndDelete({ _id: body._id })
                    .then((result) => {
                        if (result != 0) {
                            User.updateOne({ _id: body.a_user }, { $pull: { s_user: body._id } })
                                .exec()
                                .then((result) => {
                                })
                            res.status(200).json({
                                message: "deleted succeessfully",
                                result: result
                            })
                        } else {
                            res.status(301).json({
                                message: "not deleted",
                                result: "not Deleted"
                            })
                        }
                    })
                    .catch((err) => {
                        res.status(301).json({
                            message: "something went wrong",
                            result: err
                        })
                    })
            } else {
                res.status(201).json({
                    message: "User is working on assets",
                    result: result
                })
            }
        })
        .catch((err) => {
            res.status(301).json({
                message: "something went wrong",
                result: err
            })
        })

}

// Reset Password by a user
const resetPasswordSUser_a = async (req, res, next) => {
    const body = req.body
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hashSync("BBtexosoft@123", salt);
    await SUser.updateOne({ _id: body._id }, { $set: { userPassword: hash } })
        .then((result) => {
            if (result.modifiedCount === 1 && result.matchedCount === 1) {
                res.status(200).json({
                    message: "reset successfully",
                    result: "reset successfully"
                })
            } else {
                res.status(301).json({
                    message: "something went wrong",
                    result: "err"
                })
            }
        })
        .catch((err) => {
            res.status(301).json({
                message: "something went wrong",
                result: "err"
            })
        })
}



// ##################################### S-USER DASHBOARD ########################################



// GET userdata
const getData_s = async (req, res, next) => {
    await SUser.findOne({ $and: [{ _id: req.userData.userId }, { userEmail: req.userData.userEmail }] }, { userPassword: 0 })
        .populate("a_user")
        .exec()
        .then((result) => {
            if (result !== null) {
                const encrypt = CryptoJS.AES.encrypt(result.userEmail, s_key).toString()
                res.cookie('_hjuser', encrypt, { secure: true, sameSite: 'strict' })
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
            res.status(301).json({
                message: "err",
                data: err
            })
        })
}


// GET Asset Data
const getAssetData_s = async (req, res, next) => {
    await SUser.findOne({ $and: [{ _id: req.userData.userId }, { userEmail: req.userData.userEmail }] }, { userPassword: 0 })
        .populate("assets")
        .exec()
        .then((result) => {
            if (result !== null) {
                res.status(200).json({
                    message: "success",
                    data: result.assets
                })
            } else {
                res.status(404).json({
                    message: "Not Found",
                    data: result
                })
            }
        })
        .catch((err) => {
            res.status(301).json({
                message: "err",
                data: err
            })
        })
}


// Update profile
const updateProfileData_s = async (req, res, next) => {
    const body = req.body
    await SUser.updateOne({ _id: body._id }, { $set: { userName: String(body.userName), userPhone: Number(body.userPhone) } })
        .exec()
        .then((result) => {
            SUser.findById({ _id: body._id })
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

// ChangePassword -

const changePassword_s = async (req, res, next) => {
    const body = req.body
    await SUser.findById({ _id: body._id })
        .exec()
        .then((result) => {
            const checkPasswordStatus = bcrypt.compareSync(body.a_oldPassword, result.userPassword)
            if (checkPasswordStatus === true) {
                const saltRounds = 12
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(body.a_newPassword, salt);
                SUser.updateOne({ _id: result._id }, { $set: { userPassword: hash } })
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
module.exports = { craeteSUser_a, getSUserDetails_a, deleteSUser_a, resetPasswordSUser_a, getData_s, getAssetData_s, updateProfileData_s, changePassword_s }