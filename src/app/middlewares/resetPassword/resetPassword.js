const User = require('../../models/User')

module.exports = async (req, res, next) => {
    const { email, token, password } = req.body
    try {
        const user = await User.findOne({ email }).select('+passwordResetExpires passwordResetToken')

        if (!user)
            return res.status(400).send({ error: 'Usuario não encontrado' })

        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'O token informado não coincide com o token salvo' })

        const dateNow = new Date()
        if (dateNow > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token Expirado' })

        return next()
    } catch (err) {
        res.status(400).send({ error: 'Erro ao tentar recuperar senha ' + err })
    }
}
