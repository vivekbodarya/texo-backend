const User = require('../models/users/a_user')
const SUser = require('../models/users/s_user')
const Assets = require('../models/assets/assets')
// Power Looms Product
const PL_Product = require('../models/product/power_looms_product')


const createProduct_s = async (req, res, next) => {
    const body = req.body
    switch (body.assets_type) {
        case 'power_looms':
            if (req.userData.userEmail) {
                const new_PL_product = await new PL_Product({
                    product_name: body.product_name,
                    product_machine: body.product_machine,
                    assets: body.assets,
                    a_user: body.a_user_,
                    last_editing: req.userData.userEmail,
                    last_editing_date: Date().toLocaleString()
                })
                await new_PL_product.save()
                    .then(ress => {
                        Assets.updateOne({ _id: body.assets }, { $push: { power_looms_products: ress._id } })
                            .exec()
                            .then(result => {
                                res.status(200).json({
                                    message: "Product Successfully created.",
                                    result: ress
                                })
                            })
                            .catch(err => {
                                res.status(301).json({
                                    message: "err",
                                    result: "err_asset"
                                })
                            })
                    })
                    .catch(err => {
                        res.status(301).json({
                            message: "err",
                            result: "err_pl"
                        })
                    })
            } else {
                res.status(404).json({
                    message: "err",
                    result: "session not match"
                })
            }
            break;

        default:
            null
    }
}


// GEt product data by Asset id
const getproductByAsset_s = async (req, res, next) => {
    const id = req.params.id
    const body = req.body
    switch (body.type) {
        case "power_looms":
            await Assets.find({ $and: [{ _id: id }, { s_user: req.userData.userId }] })
                .populate("power_looms_products")
                .exec()
                .then(result => {
                    // console.log(result);
                    res.status(200).json({
                        message: "succ..",
                        result: result
                    })
                })
                .catch(err => {
                    res.status(301).json({
                        message: "something went wrong",
                        result: "something went wrong"
                    })
                })
            break;
        default:
            null
    }
}


// Update home product detail -- name and how many machine work
const updateProductHomeDetail_s = async (req, res, next) => {
    const body = req.body
    switch (body.assets_type) {
        case "power_looms":
            PL_Product.updateOne({ $and: [{ _id: body.product_id }, { assets: body.assets_id }] }, { $set: { product_name: body.product_name, product_machine: body.product_machine, last_editing: req.userData.userEmail, last_editing_date: Date().toLocaleString() } })
                .exec()
                .then(result => {
                    if (result.matchedCount == 1 && result.modifiedCount == 0 || result.modifiedCount == 1) {
                        res.status(200).json({
                            message: "Asset update success",
                            result: "update done"
                        })
                    }
                    else {
                        res.status(301).json({
                            message: "Something went wrong",
                            result: "somthing went wrong"
                        })
                    }
                })
                .catch(err => {
                    res.status(404).json({
                        message: "user not found",
                        result: "user not found"
                    })
                })
            break;
        default:
            null
    }
}

// DELETE product
const deleteProduct_s = async (req, res, next) => {
    const body = req.body
    switch (body.asset_type) {
        case 'power_looms':
            await PL_Product.deleteOne({ $and: [{ _id: body._id }, { assets: body.assets }] })
                .exec()
                .then(result => {
                    Assets.updateOne({ _id: body.assets }, { $pull: { 'power_looms_products': body._id } })
                        .exec()
                        .then(ress => {
                            if (result.deletedCount == 1 && ress.matchedCount == 1 && ress.modifiedCount >= 0) {
                                res.status(200).json({
                                    message: "delete success"
                                })
                            } else {
                                res.status(301).json({
                                    message: "not delete success"
                                })
                            }
                        })
                        .catch(err => {
                            res.status(301).json({
                                message: "not delete success"
                            })
                        })

                })
                .catch(err => {
                    res.status(301).json({
                        message: "not delete success"
                    })
                })
            break;
        default:
            null
    }

}
module.exports = { createProduct_s, getproductByAsset_s, updateProductHomeDetail_s, deleteProduct_s }