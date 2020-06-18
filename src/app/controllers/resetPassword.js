const express = require('express')
const User = require('../models/User')
const resetPasswordMiddleware = require('../middlewares/resetPassword/resetPassword')
const router = express.Router()

router.use(resetPasswordMiddleware)
router.post('/reset_password', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email }).select('+passwordResetExpires passwordResetToken')

        user.password = password

        await user.save()

        res.send({ data: 'Senha atualizada com sucesso' })

    } catch (err) {
        res.status(400).send({ error: 'Erro ao tentar atualizar a senha ' + err })
    }
})

module.exports = app => app.use('/reset', router)
