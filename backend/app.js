var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var logger = require('morgan')
var compression = require('compression')

const propertiesRouter = require('./routes/properties')

var app = express()

app.use(compression())
app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/properties', propertiesRouter)

module.exports = app
