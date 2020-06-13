const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')
const authUserMiddleware = require('../middlewares/registerUser/authUser')
const authValidationLogin = require('../middlewares/validationLogin/authValidationLogin')
const { response } = require('express')
const router = express.Router()

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, { expiresIn: 86400 })
}

router.use(authValidationLogin)
router.post('/authenticate', async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email }).select('+password')

        user.password = undefined

        return res.send({
            user,
            token: generateToken({ id: user.id })
        })
    } catch (error) {
        return res.status(400).send({ error: 'Ocorreu um erro ao realizar login' })
    }
})

module.exports = app => app.use('/login', router)