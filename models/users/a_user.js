const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        unique: true,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userImgUrl: {
        type: String,
        required: true
    },
    userPhone: {
        type: Number,
        required: true
    },
    isAdmin: {
        type: String,
        default: "a_user"
    },
    assets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "assets"
        }
    ],
    s_user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "s_users"
        }
    ],
    activePlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "plans",
        required: true
    },
    activePlan_start: {
        type: String,
        required: true
    },
    activePlan_end: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        enum: [true, false]
    },
    planHistory: [
        {
            oldPlan: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "plans"
            },
            startDate: {
                type: String,
            },
            endDate: {
                type: String,
            }
        }
    ],
    time: {
        type: String,
        default: Date().toLocaleString()
    }
})

module.exports = mongoose.model('users', userSchema)