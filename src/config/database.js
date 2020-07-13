const { Pool } = require('pg')

module.exports = new Pool({
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PSWD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME
})