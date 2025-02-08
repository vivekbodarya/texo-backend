const mongoose = require('mongoose')

const sUserSchema = mongoose.Schema({
    userName: {
        type: String,
        default: "NotFill"
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
    userPhone: {
        type: Number,
        required: true
    },
    userImgUrl: {
        type: String,
        required: true
    },
    isAdmin: {
        type: String,
        default: "s_user"
    },
    a_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    assets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "assets"
        }
    ],
    time: {
        type: String,
        default: Date().toLocaleString()
    }
})

module.exports = mongoose.model('s_users', sUserSchema)