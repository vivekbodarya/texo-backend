
const User = require('../models/users/a_user')
const SUser = require('../models/users/s_user')
const Assets = require('../models/assets/assets')
// Power Looms Product
const PL_Product = require('../models/product/power_looms_product')
const { default: mongoose } = require('mongoose')



const Addproduct_PL = async (req, res, next) => {
    const body = req.body
    switch (body.assets_type) {
        case "power_looms":
            const product_data = {
                _id: mongoose.Types.ObjectId(),
                date: String(body.date),
                production_taka: Number(body.production_taka),
                production_meter: Number(body.production_meter),
                stock_taka: Number(body.production_taka),
                stock_meter: Number(body.production_meter),
                sale_taka: 0,
                sale_meter: 0,
                return_taka: 0,
                return_meter: 0
            }
            await PL_Product.updateOne({ $and: [{ _id: body.product_id }, { assets: body.assets }] }, {
                $push: { product_data: product_data },
                $set: { last_editing: req.userData.userEmail, last_editing_date: Date().toLocaleString() },
                // $inc: { total_production_taka: Number(body.production_taka), total_production_meter: Number(body.production_meter) }
            })
                .exec()
                .then(result => {
                    if (result) {
                        Assets.find({ $and: [{ _id: body.assets }, { s_user: req.userData.userId }] })
                            .populate("power_looms_products")
                            .sort({ date: 1 })
                            .exec()
                            .then(resultt => {
                                res.status(200).json({
                                    message: "succ..",
                                    result: resultt
                                })
                            })
                            .catch(err => {
                                res.status(301).json({
                                    message: "something went wrong",
                                    result: "something went wrong"
                                })
                            })
                    } else {
                        res.status(301).json({
                            message: "something went wrong",
                            result: "something went wrong"
                        })
                    }
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


// Update Product

const updateProduct_PL = async (req, res, next) => {
    const body = req.body
    await PL_Product.updateOne({ $and: [{ _id: body.product_id }, { assets: body.assets }, { "product_data._id": body.production_id }] }, {
        $set: {
            "product_data.$.date": body.date,
            "product_data.$.production_taka": body.production_taka,
            "product_data.$.production_meter": body.production_meter,

            "product_data.$.sale_taka": body.sales_taka,
            "product_data.$.sale_meter": body.sales_meter,

            "product_data.$.return_taka": body.return_taka,
            "product_data.$.return_meter": body.return_meter,

            "product_data.$.party_name": body.party_name,
            "product_data.$.billno": body.sales_billno,

            "product_data.$.stock_taka": Number(body.production_taka - body.sales_taka + body.return_taka),
            "product_data.$.stock_meter": Number(body.production_meter - body.sales_meter + body.return_meter),

            last_editing: req.userData.userEmail,
            last_editing_date: Date().toLocaleString()
        },
    })
        .exec()
        .then(result => {
            if (result.matchedCount === 1 && result.modifiedCount >= 0) {
                Assets.find({ $and: [{ _id: body.assets }, { s_user: req.userData.userId }] })
                    .populate("power_looms_products")
                    .exec()
                    .then(resultt => {
                        res.status(200).json({
                            message: "succ..",
                            result: resultt
                        })
                    })
                    .catch(err => {
                        res.status(301).json({
                            message: "something went wrong",
                            result: "something went wrong"
                        })
                    })
            }
            else {
                res.status(301).json({
                    message: "not updated",
                    "result": "not updated"
                })
            }
        })
        .catch(err => {
            res.status(301).json({
                message: "not updated",
                "result": "not updated"
            })
        })
}

module.exports = { Addproduct_PL, updateProduct_PL }