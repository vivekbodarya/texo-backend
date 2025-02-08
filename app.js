const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

require('./helper/conn')


const dotenv = require('dotenv');
dotenv.config();


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// CORS
app.use(cors({
    origin: ['http://localhost:3000', 'https://bitbrains.in', 'http://localhost:3001', 'https://texo.bitbrains.in', "https://texo-bitbrains.netlify.app/"],
    credentials: true,            //access-control-allow-credentials:true
}));

// Auth Route (a_user)
const authRouter = require('./routes/a_user')

// Auth Route (s_user)
const s_authRouter = require('./routes/s_user')
// Asessts
const assets = require('./routes/assets')
// Product
const product = require('./routes/product')
// PL- Production
const plProdction = require('./routes/pl_production')
// Auth logout
const logout = require('./routes/logout/logout')
// Login
const login = require('./routes/login/login')
// Governance
const governance = require('./routes/governance')
// Plan
// GET PLAN FOR ALL USER --- OPEN FOR EVERY ONE
const plan = require('./routes/plan')


app.use('/a_user', authRouter)
app.use('/s_user', s_authRouter)
app.use('/asset', assets)
app.use('/product', product)
app.use('/pl/production', plProdction)
app.use('/logout', logout)
app.use('/login', login)
app.use('/governance', governance)


app.use('/plan', plan)


module.exports = app;
