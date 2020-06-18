const User = require('../../models/User')

module.exports = async (req, res, next) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })

        if (!user)
            return res.status(400).send({ error: 'Usuario não encontrado' })

        return next()
    } catch (err) {
        res.status(400).send({ error: 'Erro ao tentar recuperar senha' })
    }
}
