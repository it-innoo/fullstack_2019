const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const { errorHandler } = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')

app.use(cors())
app.use(bodyParser.json())

mongoose.connect(config.MONGODB_URI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use('/api/blogs', blogsRouter)

app.use(errorHandler)

module.exports = app