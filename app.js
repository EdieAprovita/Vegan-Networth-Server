require('dotenv').config()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const path = require('path')
const cors = require('cors')
const colors = require('colors')

mongoose
	.connect(process.env.DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(x =>
		console.log(
			`Connected to Mongo! Database name: "${x.connections[0].name}"`.cyan.underline
				.bold
		)
	)
	.catch(err => console.error('Error connecting to mongo', err.red))

const app_name = require('./package.json').name
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`)

const app = express()

app.use(
	cors({
		credentials: true,
		origin: [process.env.FRONTENDPOINT],
	})
)

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(logger('dev'))

const index = require('./routes/index')
app.use('/', index)

const auth = require('./routes/auth-routes')
app.use('/api/auth', auth)

const user = require('./routes/user-routes')
app.use('/api/user', user)

const post = require('./routes/post-routes')
app.use('/api/posts', post)

const profile = require('./routes/profile-routes')
app.use('/api/profile', profile)

// Uncomment this line for production
// app.get('/*', (req, res) => res.sendFile(__dirname + '/public/index.html'));

module.exports = app
