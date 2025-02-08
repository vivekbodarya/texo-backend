const User = require('../models/users/a_user')
const SUser = require('../models/users/s_user')
const Assets = require('../models/assets/assets')


// -------------------------------------------------- A_USER -------------------------------------------------


// GET All assets of a_user
const getAllAssets_a = async (req, res, next) => {
    await User.findOne({ $and: [{ _id: req.userData.userId }, { userEmail: req.userData.userEmail }] }, { userPassword: 0 })
        .populate('assets')
        .then((result) => {
            if (result !== null) {
                res.status(200).json({
                    message: "success",
                    data: result.assets
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



// Create new asstes
const createNewAsset_a = async (req, res, next) => {
    const body = req.body
    let subUser = []
    try {
        await body.subUser.map((data) => {
            if (!subUser.includes(data._id)) {
                subUser.push(data._id)
            }
        })
    } catch (e) {

    }
    const new_asset = await new Assets({
        asset_name: String(body.assetName.trim()),
        asset_type: String(body.assetType.trim()),
        asset_logo: String(body.assetLogo.trim()),
        a_user: String(body.a_user.trim()),
        s_user: subUser,
    })
    await new_asset.save()
        .then((result) => {
            User.updateOne({ _id: body.a_user }, { $push: { assets: result._id } })
                .then((a_result) => {
                    SUser.updateMany({ _id: subUser }, { $push: { assets: result._id } })
                        .then((s_result) => {
                            res.status(200).json({
                                message: "Assets added",
                                result: "Assets added"
                            })
                        })
                        .catch((err) => {
                            res.status(301).json({
                                message: "Something went wrong!",
                                result: "Assets not added"
                            })
                        })
                })
                .catch((err) => {
                    res.status(301).json({
                        message: "Something went wrong!",
                        result: "Assets not added"
                    })
                })
        })
        .catch((err) => {
            res.status(301).json({
                message: "Something went wrong!",
                result: "Assets not added"
            })
        })
}

// --------------------------------- Assets By ID -----------------------------


const getDatabyIdAsset_a = async (req, res, next) => {
    await Assets.findById({ _id: req.params.id })
        .populate('s_user a_user power_looms_products', ' -userPassword')
        .exec()
        .then((result) => {
            // console.log(result == null, result.a_user.userEmail !== req.userData.userEmail)
            if (result == null || result.a_user.userEmail != req.userData.userEmail) {
                res.status(404).json({
                    message: "user not found",
                    result: "user not found"
                })
            } else {
                res.status(200).json({
                    message: "Asset get success",
                    result: result
                })
            }
        })
        .catch((err) => {
            res.status(301).json({
                message: "Something went wrong",
                result: "user not found"
            })
        })
}


// Update Assets
const updateAsset_a = async (req, res, next) => {


    const body = req.body
    await Assets.updateOne({ _id: body.asset_id }, { $set: { asset_name: body.asset_name, asset_logo: body.asset_logo } })
        .exec()
        .then((result) => {
            if (result.matchedCount == 1 && body.userEmail == req.userData.userEmail) {
                if (result.modifiedCount == 0 || result.modifiedCount == 1) {
                    res.status(200).json({
                        message: "Asset update success",
                        result: "update done"
                    })
                } else {
                    res.status(301).json({
                        message: "Something went wrong",
                        result: "somthing went wrong"
                    })
                }
            } else {
                res.status(404).json({
                    message: "user not found",
                    result: "user not found"
                })
            }
        })
        .catch((err) => {
            res.status(301).json({
                message: "Something went wrong",
                result: "user not found"
            })
        })
}


// Sub Userupdate for asset
const updateSubUserForAsset_a = async (req, res, next) => {
    const body = req.body
    let subUser = []
    const assetuser = []
    try {
        await body.subUser.map((data) => {
            if (!subUser.includes(data._id)) {
                subUser.push(data._id)
            }
        })
    } catch (e) {

    }

    // 1. Find all (old) user of asset
    // 2. Stored into assetuser array

    await SUser.find({ assets: body.assetId })
        .then((result) => {
            if (result.length > 0) {
                result.map((data) => {
                    assetuser.push(data._id.valueOf())
                })
            }
        })
        .catch(err => {
            // console.log(err)
        })

    const new_user = []
    const remove_user = []

    // For new User List
    // 3. make subUser array for store user send data
    // 4. Find New user for access to asset
    await subUser.map((data1) => {
        assetuser.map((data2) => {
            if (data1 != data2 && !assetuser.includes(data1)) {
                if (!new_user.includes(data1)) {
                    new_user.push(data1)
                }
            }
        })
    })

    // 5. Remove un-access user from asset
    // For Remove User List
    await assetuser.map((data2) => {
        if (!subUser.includes(data2)) {
            if (!remove_user.includes(data2)) {
                remove_user.push(data2)
            }
        }
    })

    // 6. Query

    if (new_user.length == 0 && remove_user.length == 0) {
        res.status(301).json({
            message: "There is no any unique data",
            result: "There is no any unique data"
        })
    } else {
        // New user add to database 
        if (new_user.length > 0) {
            await SUser.updateMany({ _id: new_user }, { $push: { assets: body.assetId } })
                .then((result) => {
                    Assets.updateOne({ _id: body.assetId }, { $push: { s_user: new_user } })
                        .then((ress) => {
                            if (result.acknowledged != false && ress.acknowledged != false) {
                                res.status(200).json({
                                    message: "sub user updated",
                                    result: "sub user updated"
                                })
                            } else {
                                res.status(301).json({
                                    message: "sub user not updated",
                                    result: "sub user not updated"
                                })
                            }

                        })
                        .catch((err) => {
                            res.status(301).json({
                                message: "sub user not updated",
                                result: "sub user not updated"
                            })
                        })
                })
                .catch((err) => {
                    res.status(301).json({
                        message: "sub user not updated",
                        result: "sub user not updated"
                    })
                })
        }
        if (remove_user.length > 0) {

            await Assets.updateOne({ _id: body.assetId }, { $pull: { s_user: { $in: remove_user } } })
                .then((result) => {
                    SUser.updateMany({ _id: remove_user }, { $pull: { assets: body.assetId } })
                        .then((ress) => {
                            if (result.acknowledged != false && ress.acknowledged != false) {
                                res.status(200).json({
                                    message: "sub user updated",
                                    result: "sub user updated"
                                })
                            } else {
                                res.status(301).json({
                                    message: "sub user not updated",
                                    result: "sub user not updated"
                                })
                            }
                        })
                        .catch((err) => {
                            res.status(301).json({
                                message: "sub user not updated",
                                result: "sub user not updated"
                            })
                        })
                })
                .catch((err) => {
                    res.status(301).json({
                        message: "sub user not updated",
                        result: "sub user not updated"
                    })
                })
        }
    }

}




// DELETE ASSETS

const deleteAssets_a_user = async (req, res, next) => {
    const body = req.body
    const remove_user = []
    await body.s_user.map((data2) => {
        if (!remove_user.includes(data2)) {
            remove_user.push(data2._id)
        }
    })
    console.log(remove_user, body._id)
    // remove from a user
    await User.updateOne({ _id: body.a_user._id }, { $pull: { assets: body._id } })
        .then(ress => {
            SUser.updateMany({ _id: remove_user }, { $pull: { assets: body._id } })
                .then(result => {
                    Assets.deleteOne({ _id: body._id })
                        .then(fres => {
                            // console.log(fres)
                            res.status(200).json({
                                message: "Deleted",
                                result: "Deleted"
                            })
                        })
                        .catch(err => {
                            // console.log(err)
                            res.status(301).json({
                                message: "not Deleted",
                                result: "not Deleted"
                            })
                        })
                })
        })
        .catch(err => {
            res.status(301).json({
                message: "not Deleted",
                result: "not Deleted"
            })
        })

}


// ################################# S-User ########################################

const getAssetBySUser_s = async (req, res, next) => {
    await Assets.findById({ _id: req.params.id })
        .populate('s_user a_user', ' -userPassword')
        .exec()
        .then((result) => {
            if (result == null) {
                res.status(404).json({
                    message: "user not found",
                    result: "user not found"
                })
            } else {
                res.status(200).json({
                    message: "Asset get success",
                    result: result
                })
            }
        })
        .catch((err) => {
            res.status(301).json({
                message: "Something went wrong",
                result: "user not found"
            })
        })
}




module.exports = { getAllAssets_a, createNewAsset_a, getDatabyIdAsset_a, updateAsset_a, updateSubUserForAsset_a, getAssetBySUser_s, deleteAssets_a_user }