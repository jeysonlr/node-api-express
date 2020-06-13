const User = require('../../models/User')
const bcrypt = require('bcryptjs')

module.exports = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email }).select('+password')

        if (!user)
            return res.status(400).send({ error: 'Usuário não encontrado com este registro de email ' + email })

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'Usuário ou senha inválida' })

        return next()
    } catch (err) {
        return res.status(401).send({ error: 'Não foi possivel realizar login' })
    }
}