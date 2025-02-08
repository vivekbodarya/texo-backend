const mongoose = require('mongoose')

const assetSchema = mongoose.Schema({
    asset_name: {
        type: String,
        required: true
    },
    asset_type: {
        type: String,
        required: true
    },
    asset_logo: {
        type: String,
        required: true
    },
    a_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    s_user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "s_users",
            required: true
        }
    ],
    power_looms_products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "power_looms_products"
        }
    ],
    total_mtr: {
        type: Number,
    },
    total_machine: {
        type: Number,
    },
    total_taka: {
        type: Number,
    },
    time: {
        type: String,
        default: Date().toLocaleString()
    }
})
module.exports = mongoose.model('assets', assetSchema)