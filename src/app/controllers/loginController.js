const express = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')
const authValidationLogin = require('../middlewares/validationLogin/authValidationLogin')
const router = express.Router()

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
    } catch (err) {
        return res.status(400).send({ error: 'Ocorreu um erro ao realizar login ' + err })
    }
})

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, { expiresIn: 86400 })
}

module.exports = app => app.use('/login', router)