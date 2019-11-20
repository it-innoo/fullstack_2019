require('dotenv').config()

let { PORT, MONGODB_URI } = process.env

console.log('using environment: ', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.MONGODB_DEV_URI
}

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGODB_TEST_URI
}

module.exports = {
  MONGODB_URI,
  PORT
}