const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader)
            return res.status(401).send({ error: 'Token não enviado na requisição' })

        const parts = authHeader.split(' ')

        if (!parts.length === 2)
            return res.status(401).send({ error: 'Erro de token!' })

        const [bearer, token] = parts

        if (!/^Bearer$/i.test(bearer))
            return res.status(401).send({ error: 'Token mal formatado!' })

        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err)
                return res.status(401).send({ error: 'Token inválido!' })

            req.userId = decoded.id
            return next()
        })
    } catch(err) {
        res.status(500).send({error: err})
    }
}