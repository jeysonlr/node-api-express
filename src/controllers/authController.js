const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')
const authUserMiddleware = require('../middlewares/registerUser/authUser')
const { response } = require('express')
const router = express.Router()

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, { expiresIn: 86400 })
}

router.use(authUserMiddleware)
router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body)

        user.password = undefined

        return res.send({
            user,
            token: generateToken({ id: user.id })
        })
    } catch (error) {
        return res.status(400).send({ error: 'Ocorreu um erro ao registrar usuário' })
    }
});

module.exports = app => app.use('/auth', router)
