const express = require('express')
const router = express.Router()
const logintoken = require('../../models/users/logintoken');

router.post("/", (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    logintoken.deleteOne({ token: token })
        .then(() => {
            res.status(200).json({ message: "Logout Succ" })
        })
        .catch(() => {
            res.status(404).json({ message: "Logout Succ" })
        })
})


module.exports = router