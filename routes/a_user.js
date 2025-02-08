const express = require('express')
const router = express.Router()
const { isValid_a_User } = require('../helper/authHelper')
const { getData_a, updateData_a, chnagePassword_a, newuser_a } = require('../controller/a_user')
const { isValidPlan } = require('../helper/planValidator')



// GEt user data
router.get("/get", [isValid_a_User, isValidPlan], getData_a)
// UPDATE PATCH A-USER DETIAL
router.patch("/update", isValid_a_User, updateData_a)
// UPDATE PATCH A-USER PASSWORD
router.patch("/changepassword", isValid_a_User, chnagePassword_a)
// User Sign Up 
router.post('/new', newuser_a)
















// // g-auth (SignUp/LOGIN)

// router.post("/g-auth", (req, res, next) => {

//     User.find({ userEmail: req.body.userEmail })
//         .exec()
//         .then((result) => {
//             if (result.length < 1) {
//                 const new_user = new User({
//                     _id: mongoose.Types.ObjectId(),
//                     userName: req.body.userName,
//                     userEmail: req.body.userEmail,
//                     userPassword: 'g-auth',
//                     userPhone: 0,
//                     userImgUrl: req.body.userEmail[0]
//                 })
//                 new_user.save()
//                     .then((ress) => {
//                         req.session.userEmail = req.body.userEmail
//                         req.session.userId = ress._id;
//                         req.session.isAuth = true;
//                         req.session.role = "a_user"
//                         req.session.save();
//                         res.cookie('isAuth', 'true')
//                         res.cookie('role', 'a_user')
//                         res.status(201).json({
//                             message: "User Login Success"
//                         })
//                     })
//                     .catch((err) => {
//                         res.status(401).json({
//                             message: err
//                         })
//                     })
//             } else if (result.length === 1) {
//                 req.session.userEmail = req.body.userEmail;
//                 req.session.userId = result[0]._id;
//                 req.session.isAuth = true;
//                 req.session.role = "a_user"
//                 req.session.save();
//                 res.cookie('isAuth', 'true')
//                 res.cookie('role', 'a_user')
//                 res.status(200).json({
//                     message: "User Exist"
//                 })
//             }
//         })
//         .catch((err) => {
//             res.status(301).json({
//                 message: err
//             })
//         })
// })



// // ---------------------------------- ANalytics -------------------------------

// // Master API1

// router.get("/analytics1", isValid_a_User, async (req, res, next) => {
//     let flag = 0
//     let data = []
//     let objData = {}
//     await User.findOne({ $and: [{ _id: req.session.userId }, { userEmail: req.session.userEmail }] }, { userPassword: 0 })
//         .exec()
//         .then((result) => {
//             if (result !== null) {
//                 // data.push({ userData: result })
//                 objData = {
//                     ...objData,
//                     userData: result
//                 }
//                 flag = flag + 1
//             } else {
//                 res.status(404).json({
//                     message: "Not Found",
//                     data: result
//                 })
//             }
//         })
//     // .catch((err) => {
//     //     res.status(301).json({
//     //         message: "err",
//     //         data: err
//     //     })
//     // })

//     await Assets.find({ a_user: req.session.userId })
//         .exec()
//         .then((a_result) => {
//             if (a_result !== null) {
//                 objData = {
//                     ...objData,
//                     Assets: a_result
//                 }
//                 // data.push({ Assets: a_result })
//                 flag = flag + 1
//             }
//         })

//     await PL_Product.find({ a_user: req.session.userId })
//         .exec()
//         .then((pl_result) => {
//             if (pl_result !== null) {
//                 objData = {
//                     ...objData,
//                     pl_data: pl_result
//                 }
//                 // data.push({ pl_data: pl_result })
//                 flag = flag + 1
//             } else {
//                 objData = {
//                     ...objData,
//                     pl_data: ""
//                 }
//                 // data.push({ pl_data: [] })
//                 flag = flag + 1
//             }
//         })



//     if (flag === 3) {
//         res.status(200).json({
//             message: "success",
//             data: objData
//         })
//     } else {
//         res.status(301).json({
//             message: "err",
//             data: "err"
//         })
//     }
// })


module.exports = router