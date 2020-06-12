const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost/noderest', {useMongoClient: true})
mongoose.connect('mongodb+srv://jeyson-node-api-express:jeyson@cluster0-w7tnd.mongodb.net/<dbname>?retryWrites=true&w=majority', {useNewUrlParser: true})
mongoose.Promise = global.Promise

module.exports = mongoose
