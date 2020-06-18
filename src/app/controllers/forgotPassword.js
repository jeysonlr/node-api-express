const express = require('express')
const User = require('../models/User')
const crypto = require('crypto')
const forgotPasswordMiddleware = require('../middlewares/forgotPassword/forgotPassword')
const mailer = require('../../modules/mailer')
const router = express.Router()

router.use(forgotPasswordMiddleware)
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        const token = crypto.randomBytes(20).toString('hex')

        const expired = new Date()
        expired.setHours(expired.getHours() + 1)


        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: expired
            }
        }, { new: true, useFindAndModify: false }
        );

        mailer.sendMail({
            to: email,
            from: 'heloisafernanda88@gmail.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            if (err)
                return res.status(400).send({ error: 'Erro ao enviar email para ' + email + ' ' + err })

            return res.send({ data: 'Email enviado com sucesso para ' + email });
        })
    } catch (err) {
        res.status(400).send({ error: 'Error on forgot password, try again' + err })
    }
})

module.exports = app => app.use('/forgot', router)
