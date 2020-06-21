const express = require('express')
const bodyParser = require('body-parser')

const YAML = require('yamljs')
const swaggerDoc = YAML.load('./swagger.yaml')
const swaggerUi = require('swagger-ui-express')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

require('./app/controllers/index')(app)

app.listen(3000)
