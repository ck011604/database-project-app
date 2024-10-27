const mysql = require('mysql2');
// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,   //  database host
  user: process.env.DB_USER, //  MySQL username
  password: process.env.DB_PASSWORD, //  MySQL password
  database: process.env.DB_NAME, // database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
module.exports = pool;