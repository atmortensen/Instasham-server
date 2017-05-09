const pg = require('pg')
if(!process.env.PORT){
  require('dotenv').config()
}

const poolConfig = {
  user: process.env.DB_USER, 
  database: process.env.DB_NAME, 
  password: process.env.DB_PASS, 
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT, 
  ssl: true,
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
}

module.exports = new pg.Pool(poolConfig)