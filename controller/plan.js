const plan = require("../models/plan/plan")


// GET All assets of a_user
const getAllPlanForUser = async (req, res, next) => {
    let arr = []
    const body = req.body
    const asset = await String(body.asset.trim())
    const days = await String(body.days.trim())
    const type = await String(body.type.trim())
    let looms = 'false'
    if (type == 'looms') {
        looms = 'true'
    }
    await plan.find({ planDays: days, accessAssets: asset, looms: looms, typeofPlan: 'new' })
        .select('-_id -_v -noTimeUsedPlan -createdAt -updatedAt')
        .then(result => {
            if (result.length > 0) {
                res.status(200).json({
                    message: "Succ...",
                    result: result
                })
            } else {
                res.status(301).json({
                    message: "Contact us. Details show in footer.",
                    result: "No plan available"
                })
            }
        }).catch(err => {
            res.status(301).json({
                message: "Something went wrong! Try again later.",
                result: "failed..."
            })
        })
}

const getAllPlanForUser_ = async (req, res, next) => {
    await plan.find({ typeofPlan: 'new' })
        .select('-_id -_v -noTimeUsedPlan -createdAt -updatedAt')
        .then(result => {
            if (result.length > 0) {
                res.status(200).json({
                    message: "Succ...",
                    result: result
                })
            } else {
                res.status(301).json({
                    message: "No plan available",
                    result: "No plan available"
                })
            }
        }).catch(err => {
            res.status(301).json({
                message: "Something went wrong! Try again later.",
                result: "failed..."
            })
        })
}
module.exports = { getAllPlanForUser, getAllPlanForUser_ }