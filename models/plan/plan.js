const mongoose = require('mongoose')

const planSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    planName: {
        type: String,
        required: true
    },
    planCode: {
        type: String,
        required: true
    },
    planPrice: {
        type: String,
        required: true
    },
    planDays: {
        type: String,
        required: true
    },
    accessAssets: {
        type: String,
        required: true
    },
    looms: {
        type: String,
        required: true,
        enum: ['true', 'false']
    },
    backup: {
        type: String,
        required: true,
        enum: ['true', 'false']
    },
    offer: {
        type: String,
        required: true,
        enum: ['true', 'false']
    },
    typeofPlan: {
        type: String,
        required: true,
        enum: ["old", "new"]
    },
    noTimeUsedPlan: {
        type: Number,
        default: 0
    },
}, { timestamps: true })

module.exports = mongoose.model('plans', planSchema)