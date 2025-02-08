const jwt = require('jsonwebtoken');
const logintoken = require('../models/users/logintoken');
const key = process.env.TOKEN_KEY;
const akey = process.env.ATOKEN_KEY;

const isValid_a_User = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const isAuth = req.headers.isauth
        const role = req.headers.role
        const decoded = jwt.verify(token, key)
        if (!token || isAuth != "true" || role != "a_user") {
            return res.status(404).json({
                message: "Forbidden"
            })
        }
        const isLogin = await logintoken.findOne({ token: token })
        if (!isLogin) {
            return res.status(404).json({
                message: "Forbidden"
            })
        } else {
            req.userData = decoded
            next()
        }

    } catch (e) {
        res.status(404).json({
            message: "Forbidden"
        })
    }
}

const isValid_s_User = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isAuth = req.headers.isauth
        const role = req.headers.role
        const decoded = jwt.verify(token, key)
        if (!token || isAuth != "true" || role != "s_user") {
            return res.status(404).json({
                message: "Forbidden"
            })
        }
        const isLogin = await logintoken.findOne({ token: token })
        if (!isLogin) {
            return res.status(404).json({
                message: "Forbidden"
            })
        } else {
            req.userData = decoded
            next()
        }

    } catch (e) {
        // const token = req.headers.authorization.split(" ")[1];
        res.status(404).json({
            message: "Forbidden"
        })
    }
}



const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isAuth = req.headers.isauth
        const admin = req.headers.admin
        const key_ = req.headers.key
        const decoded = jwt.verify(token, akey)
        if (!token || isAuth != "true" || admin != "admin" || key_ != "true") {
            return res.status(404).json({
                message: "Forbidden"
            })
        }
        const isLogin = await logintoken.findOne({ token: token })
        if (!isLogin) {
            return res.status(404).json({
                message: "Forbidden"
            })

        } else {
            req.userData = decoded
            next()
        }

    } catch (e) {
        // const token = req.headers.authorization.split(" ")[1];
        res.status(404).json({
            message: "Forbidden"
        })
    }
}



module.exports = { isValid_a_User, isValid_s_User, isAdmin }