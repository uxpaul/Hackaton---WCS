'use strict'
let http = require('http')
let express = require('express')
let app = exports.app = express()
let bodyParser = require('body-parser')
let methodOverride = require('method-override')
let morgan = require('morgan')
let mongoose = require('mongoose')
const ENV = require('./config/env')

let routes = require('./app/routes')
const port = process.env.PORT || 3000 // (process.env.PORT ? process.env.PORT : 8000) => process.env.PORT || 8000

app.use(express.static(__dirname + '/public'))
// logs
app.use(morgan('combined'))
// Get request's infos
app.use(bodyParser.urlencoded({
    'extended': 'true'
}))
app.use(bodyParser.json())
app.use(bodyParser.json({limit: '100000mb'}))
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}))

app.use(methodOverride('X-HTTP-Method-Override'))

app.use('/api',routes(app))

// Create server
let server = http.Server(app)

server.listen(port)
console.log(`server listening on port ${port}`)

//Méthode pour quitter "proprement" l'application
process.on('SIGINT', function() {
    console.log("\nStopping...")
    process.exit()
});

mongoose.connect(ENV.db)

// Création d'un middleware pour logger les erreurs
app.use((error, request, response, next) => {
    // Middleware to catch all errors
    console.error(error.stack)
    response.status(500).send(error.message)
})
