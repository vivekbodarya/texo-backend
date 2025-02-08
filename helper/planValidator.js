const plan = require("../models/plan/plan")
const a_user = require("../models/users/a_user")
const s_user = require("../models/users/s_user")

const isValidPlan = async (req, res, next) => {
    try {
        const user = await a_user.findById({ _id: req.userData.userId }).populate("activePlan")
        if (!user) {
            return res.status(404).json({
                message: "Forbidden"
            })
        }
        if (user.assets?.length > Number(user.activePlan?.accessAssets)) {
            await a_user.findByIdAndUpdate({ _id: req.userData.userId }, { $set: { isActive: false } })
        }
        var d = new Date();
        var todayDate = d.toLocaleString("en-US", "Asia/Delhi")
        const today = await new Date(todayDate);
        const end = await new Date(user.activePlan_end);
        const diffInMs = await end.getTime() - today.getTime();
        var days = await Math.floor(diffInMs / (3600 * 24 * 1000))
        if (days >= 0 && user.isActive == true) {
            next()
        } else {
            await a_user.findByIdAndUpdate({ _id: req.userData.userId }, { $set: { isActive: false } })
            next()
        }
    } catch (e) {
        res.status(404).json({
            message: "Forbidden"
        })
    }
}

const isValidPlan_s = async (req, res, next) => {
    try {
        const user = await s_user.findById({ _id: req.userData.userId }).populate("a_user")
        if (!user) {
            return res.status(404).json({
                message: "Forbidden"
            })
        }


        const auser = await a_user.findById({ _id: user.a_user._id }).populate("activePlan")
        if (!auser) {
            return res.status(404).json({
                message: "Forbidden"
            })
        }
        if (auser.assets?.length > Number(auser.activePlan?.accessAssets)) {
            await a_user.findByIdAndUpdate({ _id: user.a_user._id }, { $set: { isActive: false } })
        }


        var d = new Date();
        var todayDate = d.toLocaleString("en-US", "Asia/Delhi")
        const today = await new Date(todayDate);
        const end = await new Date(user.a_user.activePlan_end)

        const diffInMs = await end.getTime() - today.getTime();
        var days = await Math.floor(diffInMs / (3600 * 24 * 1000))
        if (days >= 0 && user.a_user.isActive == true) {
            next()
        } else {
            await a_user.findByIdAndUpdate({ _id: user.a_user._id }, { $set: { isActive: false } })
            next()
        }
    } catch (e) {
        res.status(404).json({
            message: "Forbidden"
        })
    }
}

module.exports = { isValidPlan, isValidPlan_s }