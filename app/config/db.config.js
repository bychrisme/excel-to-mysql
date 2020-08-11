import * as dotenv from 'dotenv';
dotenv.config();

let dbConfig = {
    host    : process.env.DB_HOST,
    user    : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: process.env.DB_SOCKET_PATH
  };
  
module.exports = dbConfig;