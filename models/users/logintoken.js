const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loginTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "onModel"
    },
    onModel: {
        type: String,
        required: true,
        enum: ["users", "s_users", "governances"]
    },
    token: {
        type: String,
        required: true,
    },
    user_type: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("logintoken", loginTokenSchema);