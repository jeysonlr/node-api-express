const express = require('express')
const jwt = require('jsonwebtoken')
const authConfig = require('../../../config/auth.json')

// class GenerateToken {
//     generateToken(params = {}) {
//         return jwt.sign(params, authConfig.secret, { expiresIn: 86400 })
//     }
// }

// module.exports = GenerateToken
