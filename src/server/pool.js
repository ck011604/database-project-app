const mysql = require('mysql2');
// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',   //  database host
    user: 'root', //  MySQL username
    password: 'P@sswordDB123', //  MySQL password
    database: 'restaurantdb', // database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = pool;
