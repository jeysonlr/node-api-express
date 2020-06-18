const User = require('../../models/User')

module.exports = async (req, res, next) => {
    try {
        const { email } = req.body

        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'Ja existe um usuario cadastrado com este email ' + email })

        return next()
    } catch (err) {
        return res.status(401).send({ error: 'Não foi possivel realizar o cadastro!' })
    }
}
