const mongoose = require('mongoose')

const governanceSchema = mongoose.Schema({
    userEmail: {
        type: String,
        unique: true,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userPin: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["masteradmin"]
    },
    isActive: {
        type: Boolean,
        required: true,
        enum: [true, false]
    },
    time: {
        type: String,
        default: Date().toLocaleString()
    }
})

module.exports = mongoose.model('governances', governanceSchema)